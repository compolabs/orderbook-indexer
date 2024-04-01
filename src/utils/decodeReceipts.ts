import {getDecodedLogs, TransactionResultReceipt} from "fuels";
import isEvent from "./isEvent";
import {OrderbookAbi} from "../sdk/blockchain/fuel/types/orderbook";
type TMarketCreateEvent = {
    asset_id: string,
    asset_decimals: number,
    timestamp: string
}
type TOrderChangeEvent = {
    order_id: string,
    trader: string,
    base_token: string,
    base_size_change: string,
    base_price: string,
    timestamp: string
}
type TTradeEvent = {
    base_token: string
    order_matcher: string
    seller: string
    buyer: string
    trade_size: string
    trade_price: string
    timestamp: string
}
type TDecodedEvent = TMarketCreateEvent
    | TOrderChangeEvent
    | TTradeEvent

export function decodeReceipts(receipts: TransactionResultReceipt[], abi: OrderbookAbi): TDecodedEvent[] {
    try {
        const logs = getDecodedLogs(receipts, abi.interface)
        const decodedLogs = logs.map((log: any) => {
            // MarketCreateEvent
            if (isEvent("MarketCreateEvent", log, abi)) {
                return {
                    asset_id: log.asset_id.value,
                    asset_decimals: log.asset_decimals,
                    timestamp: log.timestamp.toString()
                } as TMarketCreateEvent
            }
            // OrderChangeEvent
            if (isEvent("OrderChangeEvent", log, abi)) {
                return {
                    order_id: log.order_id,
                    trader: log.trader.value,
                    base_token: log.base_token.value,
                    base_size_change: (log.base_size_change.negative ? "-" : "") + log.base_size_change.value.toString(),
                    base_price: log.base_price.toString(),
                    timestamp: log.timestamp.toString()
                } as TOrderChangeEvent;
            }
            // TradeEvent
            if (isEvent("TradeEvent", log, abi)) {
                return {
                    base_token: log.base_token.value,
                    order_matcher: log.order_matcher.value,
                    seller: log.seller.value,
                    buyer: log.buyer.value,
                    trade_size: log.trade_size.toString(),
                    trade_price: log.trade_price.toString(),
                    sell_order_id: log.sell_order_id,
                    buy_order_id: log.buy_order_id,
                    timestamp: log.timestamp.toString(),
                } as TTradeEvent;
            }
        })
        return decodedLogs.filter(e => e !== undefined) as TDecodedEvent[]
    } catch (e) {
        console.error(e, receipts)
        return []
    }
}
