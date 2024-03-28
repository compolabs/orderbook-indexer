import {getDecodedLogs, WalletUnlocked} from "fuels";
import {OrderbookAbi, OrderbookAbi__factory} from "./blockchain/fuel/types/orderbook";
import axios from "axios";
import {TransactionResultReceipt} from "@fuel-ts/account/dist/providers/transaction-response/transaction-response";
import {BN} from "@fuel-ts/math";
import {ReceiptLogData} from "@fuel-ts/transactions/dist/coders/receipt";

export async function decodeIndexerResponse(contractId: string, fromBlock: number, wallet: WalletUnlocked) {
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

export function getEventFields(eventName: string, factory: OrderbookAbi): string[] | undefined {
    const jsonAbiEventTypes = factory.interface.jsonAbi.types.find(jsonAbiType => jsonAbiType.type.includes(eventName));
    return jsonAbiEventTypes?.components?.map(({name}) => name)
}

export function checkFieldsInObject(obj: any, fields: string[]): boolean {
    return typeof obj === 'object' && fields.every(field => field in obj);
}

export function decodeOrder(order: any){
    return {
        id: order.id,
        trader: order.trader.value,
        base_token: order.base_token.value,
        base_size: (order.base_size.negative ? "-" : "") + order.base_size.value.toString(),
        base_price: order.base_price.toString(),
    };
}
