import {beforeEach, describe, expect, it} from "@jest/globals";

import {FuelNetwork} from "../src/blockchain";

import {PRIVATE_KEY_ALICE, TEST_TIMEOUT} from "./constants";
import {BaseAssetId, ContractFactory, getDecodedLogs, sleep, WalletUnlocked} from "fuels";
import {OrderbookAbi, OrderbookAbi__factory} from "../src/blockchain/fuel/types/orderbook";
import {CONTRACT_ADDRESSES} from "../src/blockchain/fuel/constants";
import {ReceiptLogData} from "@fuel-ts/transactions/dist/coders/receipt";
import {BN} from "@fuel-ts/math";
import {TransactionResultReceipt} from "@fuel-ts/account/dist/providers/transaction-response/transaction-response";
import axios from "axios";
import {readFileSync, writeFileSync} from "fs";
import {Api} from "../src/blockchain/fuel/Api";


const MOCK_BTC_AMOUNT = "100000";
const MOCK_BTC_PRICE = "69200000000000";


describe("Spot Test", () => {
    let fuelNetwork: FuelNetwork;

    beforeEach(async () => {
        fuelNetwork = new FuelNetwork();
        await fuelNetwork.connectWalletByPrivateKey(PRIVATE_KEY_ALICE);
    });

    it(
        "should emit data",
        async () => {
            const wallet = fuelNetwork.walletManager.wallet!;

            console.log("Wallet address: ", wallet.address)
            console.log("Eth balance   : ", await wallet.getBalance(BaseAssetId).then(b => b.toString()), " ETH")

            const byteCode = readFileSync(`./contract/out/debug/orderbook.bin`);
            const abi = JSON.parse(readFileSync(`./contract/out/debug/orderbook-abi.json`, 'utf8'));

            const orderbookfactory = new ContractFactory(byteCode, abi, wallet);
            const {minGasPrice: gasPrice} = wallet.provider.getGasConfig();

            const btc = fuelNetwork.getTokenBySymbol("BTC");
            const usdc = fuelNetwork.getTokenBySymbol("USDC");

            const configurableConstants = {
                QUOTE_TOKEN: {value: usdc.assetId},
                QUOTE_TOKEN_DECIMALS: 6,
                PRICE_DECIMALS: 9,
            }
            const blockNumber = await fuelNetwork.getProviderWallet().then(res => res.provider.getBlockNumber()).then(res => res.toNumber())
            const contract = await orderbookfactory.deployContract({gasPrice, configurableConstants});
            const contractId = contract.id.toHexString()
            console.log({contractId, blockNumber})

            writeFileSync("./addresses.json", JSON.stringify({orderbook: contractId, blockNumber}))

            const api = new Api();

            await api.createSpotMarket(btc, 8, wallet, contractId);
            console.log("Market created: ", btc.assetId)
            await fuelNetwork.mintToken(btc.assetId, new BN(+MOCK_BTC_AMOUNT).abs().toNumber())
            console.log(`0.001 btc Token minted`)
            const {orderId: sellOrderId} = await api.createSpotOrder(btc, usdc, "-100000", (69000 * 1e9).toString(), wallet, contractId);
            console.log({sellOrderId})

            await fuelNetwork.mintToken(usdc.assetId, 70 * 1e6)
            console.log(`70 USDC Token minted`)
            const {orderId: buyOrderId} = await api.createSpotOrder(btc, usdc, "100000", (70000 * 1e9).toString(), wallet, contractId);

            await sleep(1000)
            const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);

            const sellOrder = await orderbookAbi.functions.order_by_id(sellOrderId).simulate().then(res => res.value)
            const buyOrder = await orderbookAbi.functions.order_by_id(buyOrderId).simulate().then(res => res.value)
            console.log({sellOrder: decodeOrder(sellOrder), buyOrder: decodeOrder(buyOrder)})
            await api.matchSpotOrders(sellOrderId, buyOrderId, wallet, contractId).catch(e => console.error(e.cause.logs));
            console.log("Orders matched")
            await sleep(1000)

            const events = await decodeIndexerResponse(contractId, blockNumber, wallet)
            console.log(events)
        },
        TEST_TIMEOUT,
    );


});

async function decodeIndexerResponse(contractId: string, fromBlock: number, wallet: WalletUnlocked) {
    const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);
    const request = {
        "from_block": fromBlock,
        "transactions": [{"owner": [contractId]}],
        "field_selection": {"receipt": ["receipt_type", "contract_id", "ra", "rb", "ptr", "len", "digest", "pc", "is", "data"]}
    }

    const indexerData = await axios.post("https://fuel.hypersync.xyz/query", request).then(response => response.data);
    const rawReceipts = (indexerData as any).data[0].receipts.filter(({receipt_type}: any) => receipt_type == 6);
    const receipts: TransactionResultReceipt[] = rawReceipts.map((receipt: any) => ({
        type: receipt.receipt_type,
        id: receipt.contract_id,
        val0: new BN(receipt.ra),
        val1: new BN(receipt.rb),
        ptr: new BN(receipt.ptr),
        len: new BN(receipt.len),
        digest: receipt.digest,
        pc: new BN(receipt.pc),
        is: new BN(receipt.is),
        data: receipt.data
    } as ReceiptLogData & { data: string }))

    let result: any[] = []
    for (let i = 0; i < receipts.length; i++) {
        try {
            const logs = getDecodedLogs([receipts[i]], orderbookAbi.interface)
            const decodedLogs = logs.map((log: any) => {
                // MarketCreateEvent
                if (checkFieldsInObject(log, getEventFields("MarketCreateEvent", orderbookAbi)!)) {
                    return {
                        asset_id: log.asset_id.value,
                        asset_decimals: log.asset_decimals,
                        timestamp: log.timestamp.toString()
                    }
                }
                // OrderChangeEvent
                if (checkFieldsInObject(log, getEventFields("OrderChangeEvent", orderbookAbi)!)) {
                    return {
                        order_id: log.order_id,
                        trader: log.trader.value,
                        base_token: log.base_token.value,
                        base_size_change: (log.base_size_change.negative ? "-" : "") + log.base_size_change.value.toString(),
                        base_price: log.base_price.toString(),
                        timestamp: log.timestamp.toString()
                    };
                }
                // TradeEvent'
                if (checkFieldsInObject(log, getEventFields("TradeEvent", orderbookAbi)!)) {
                    return {
                        base_token: log.base_token.value,
                        order_matcher: log.order_matcher.value,
                        seller: log.seller.value,
                        buyer: log.buyer.value,
                        trade_size: log.trade_size.toString(),
                        trade_price: log.trade_price.toString(),
                        timestamp: log.timestamp.toString(),
                    };
                }
            })
            result = [...result, ...decodedLogs]
        } catch (e) {
            console.error(e)
        }
    }
    return result
}

function getEventFields(eventName: string, factory: OrderbookAbi): string[] | undefined {
    const jsonAbiEventTypes = factory.interface.jsonAbi.types.find(jsonAbiType => jsonAbiType.type.includes(eventName));
    return jsonAbiEventTypes?.components?.map(({name}) => name)
}

function checkFieldsInObject(obj: any, fields: string[]): boolean {
    return typeof obj === 'object' && fields.every(field => field in obj);
}

function decodeOrder(order: any){
    return {
        id: order.id,
        trader: order.trader.value,
        base_token: order.base_token.value,
        base_size: (order.base_size.negative ? "-" : "") + order.base_size.value.toString(),
        base_price: order.base_price.toString(),
    };
}
