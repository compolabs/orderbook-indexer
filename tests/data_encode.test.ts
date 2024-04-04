import {beforeEach, describe, it} from "@jest/globals";
import {BaseAssetId, ContractFactory, sleep} from "fuels";

import {readFileSync, writeFileSync} from "fs";
import {FuelNetwork} from "../src/sdk/blockchain";
import {Api} from "../src/sdk/blockchain/fuel/Api";
import {OrderbookAbi__factory} from "../src/sdk/blockchain/fuel/types/orderbook";
import {PRIVATE_KEY} from "../src/config";
import fetchReceiptsFromEnvio from "../src/utils/fetchReceiptsFromEnvio";
import {decodeReceipts} from "../src/utils/decodeReceipts";

describe("Envio indexer data encode test", () => {
    let fuelNetwork: FuelNetwork;

    beforeEach(async () => {
        fuelNetwork = new FuelNetwork();
        await fuelNetwork.connectWalletByPrivateKey(PRIVATE_KEY);
    });

    it("should emit and decode data", async () => {
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

            writeFileSync("./tests/addresses.json", JSON.stringify({contractId, blockNumber}))

            const api = new Api();

            await api.createSpotMarket(btc, 8, wallet, contractId);
            console.log("Market created: ", btc.assetId)
            await fuelNetwork.mintToken(btc.assetId, 0.001 * 1e8)
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

            const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, +blockNumber + 1000, contractId)
            const events = decodeReceipts(receiptsResult?.receipts!, orderbookAbi)
            console.log(events)
        },
        60_000,
    );

    it("should create and cancel order", async () => {
            const wallet = fuelNetwork.walletManager.wallet!;

            console.log("Wallet address: ", wallet.address)
            console.log("Eth balance   : ", await wallet.getBalance(BaseAssetId).then(b => b.toString()), " ETH")

            const {contractId, blockNumber} = JSON.parse(readFileSync("./tests/addresses.json").toString())
            console.log({contractId, blockNumber})

            const btc = fuelNetwork.getTokenBySymbol("BTC");
            const usdc = fuelNetwork.getTokenBySymbol("USDC");

            const api = new Api();

            await fuelNetwork.mintToken(btc.assetId, 0.001 * 1e8)
            console.log(`0.001 btc Token minted`)
            const {orderId: sellOrderId} = await api.createSpotOrder(btc, usdc, "-100000", (69111 * 1e9).toString(), wallet, contractId);
            console.log({sellOrderId})

            await api.cancelSpotOrder(sellOrderId, wallet, contractId)
        },
        60_000,
    );

    it("should decode data", async () => {
            const wallet = fuelNetwork.walletManager.wallet!;
            const {contractId, blockNumber} = JSON.parse(readFileSync("./tests/addresses.json").toString())

            const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, blockNumber + 1000, contractId)
            const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);
            if (receiptsResult === null) return;
            console.log(decodeReceipts(receiptsResult.receipts, orderbookAbi!))
        },
        60_000,
    );

});


function decodeOrder(order: any) {
    return {
        id: order.id,
        trader: order.trader.value,
        base_token: order.base_token.value,
        base_size: (order.base_size.negative ? "-" : "") + order.base_size.value.toString(),
        base_price: order.base_price.toString(),
    };
}
