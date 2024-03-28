import {beforeEach, describe, expect, it} from "@jest/globals";

import {FuelNetwork} from "../src/blockchain";

import {PRIVATE_KEY_ALICE, TEST_TIMEOUT} from "./constants";
import {getDecodedLogs} from "fuels";
import {OrderbookAbi, OrderbookAbi__factory} from "../src/blockchain/fuel/types/orderbook";
import {CONTRACT_ADDRESSES} from "../src/blockchain/fuel/constants";
import {ReceiptLogData} from "@fuel-ts/transactions/dist/coders/receipt";
import {BN} from "@fuel-ts/math";
import {TransactionResultReceipt} from "@fuel-ts/account/dist/providers/transaction-response/transaction-response";
import axios from "axios";


const MOCK_BTC_AMOUNT = "100000";
const MOCK_BTC_PRICE = "69200000000000";

describe("Spot Test", () => {
    let fuelNetwork: FuelNetwork;

    beforeEach(async () => {
        fuelNetwork = new FuelNetwork();
        await fuelNetwork.connectWalletByPrivateKey(PRIVATE_KEY_ALICE);
    });

    it(
        "should create order",
        async () => {
            const btc = fuelNetwork.getTokenBySymbol("BTC");
            let hash = "";
            try {
                await fuelNetwork.mintToken(btc.assetId, new BN(+MOCK_BTC_AMOUNT).abs().toNumber())
                hash = await fuelNetwork.createSpotOrder(btc.assetId, MOCK_BTC_AMOUNT, MOCK_BTC_PRICE);
            } catch (error) {
                throw new Error(`Create order should not throw an error: ${error}`);
            }

            expect(hash).toBeDefined();
            expect(hash).not.toBe("");
        },
        TEST_TIMEOUT,
    );

    it(
        "should match orders",
        async () => {
            let hash = "";
            try {
                const btc = fuelNetwork.getTokenBySymbol("BTC");
                let hash = "";
                try {
                    await fuelNetwork.mintToken(btc.assetId, new BN(+MOCK_BTC_AMOUNT).abs().toNumber())
                    hash = await fuelNetwork.createSpotOrder(btc.assetId, MOCK_BTC_AMOUNT, MOCK_BTC_PRICE);
                } catch (error) {
                    throw new Error(`Create order should not throw an error: ${error}`);
                }


                hash = await fuelNetwork.matchSpotOrders(
                    "0x20fbfada264aa04ae7e38c75b8c0b7fe32f0fa8e2bdac0e2465254feaddc37c6", "0xf37f10f7b19dacdbc0677c3469ff9ed2577b09d0307a13d4c867a6600d79c247"
                );
            } catch (error) {
                throw new Error(`Match orders should not throw an error: ${error}`);
            }

        },
        TEST_TIMEOUT,
    );

    it(
        "should decode",
        async () => {
            const orderbookFactory = OrderbookAbi__factory.connect(
                CONTRACT_ADDRESSES.spotMarket,
                await fuelNetwork.getProviderWallet(),
            );

            const request = {
                "from_block": 8179093,
                "transactions": [{"owner": ["0xbac8452c3af59ae7b04986f130d738685675227bc4d326d753a559f8245a0380"]}],
                "field_selection": {"receipt": ["receipt_type", "contract_id", "ra", "rb", "ptr", "len", "digest", "pc", "is", "data"]}
            }

            const indexerData = await axios.post("http://fuel.hypersync.xyz/query", request).then(response => response.data);
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

            for (let i = 0; i < receipts.length; i++) {
                try {
                    const logs = getDecodedLogs([receipts[i]], orderbookFactory.interface)
                    const res = logs.map((log: any) => {
                        // MarketCreateEvent
                        if (checkFieldsInObject(log, getEventFields("MarketCreateEvent", orderbookFactory)!)) {
                            return {
                                asset_id: log.asset_id.value,
                                asset_decimals: log.asset_decimals,
                                timestamp: log.timestamp.toString()
                            }
                        }
                        // OrderChangeEvent
                        if (checkFieldsInObject(log, getEventFields("OrderChangeEvent", orderbookFactory)!)) {
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
                        if (checkFieldsInObject(log, getEventFields("TradeEvent", orderbookFactory)!)) {
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
                    console.log(res)
                } catch (e) {
                }

            }
        },
        TEST_TIMEOUT,
    );

});

function getEventFields(eventName: string, factory: OrderbookAbi): string[] | undefined {
    const jsonAbiEventTypes = factory.interface.jsonAbi.types.find(jsonAbiType => jsonAbiType.type.includes(eventName));
    return jsonAbiEventTypes?.components?.map(({name}) => name)
}

function checkFieldsInObject(obj: any, fields: string[]): boolean {
    return fields.every(field => field in obj);
}

