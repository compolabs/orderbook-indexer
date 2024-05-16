import {Contract, TransactionResultReceipt} from "fuels";
import {decodeReceipts} from "../utils/decodeReceipts";
import {PerpMarketAbi} from "../sdk/blockchain/fuel/types/perp-market";
import isEvent from "../utils/isEvent";
import tai64ToDate from "../utils/tai64ToDate";
export function decodePerpMarketReceipts(receipts: TransactionResultReceipt[], abi: Contract): any[] {
    const perpMarketDecoders = [decodeTradeEvent,decodeOrderEvent]
    return decodeReceipts(receipts, abi, perpMarketDecoders)
}

const decodeTradeEvent = (log: any, abi: PerpMarketAbi) => {
    if (isEvent("TradeEvent", log, abi)) {
        return {
            eventName: "TradeEvent",

            base_token: log.base_token.value,
            seller: log.seller.value,
            buyer: log.buyer.value,
            trade_size: log.trade_size.toString(),
            trade_price: log.trade_price.toString(),
            sell_order_id: log.sell_order_id,
            buy_order_id: log.buy_order_id,
            timestamp: tai64ToDate(log.timestamp.toString()),

        }
    }
}

const decodeOrderEvent = (log: any, abi: PerpMarketAbi) => {
    if (isEvent("OrderEvent", log, abi)) {
        return {
            eventName: "OrderEvent",

            order_id: log.order_id,
            sender: log.sender?.Address?.value ?? log.sender?.ContractId?.value ,
            timestamp: tai64ToDate(log.timestamp.toString()),
            identifier: log.identifier,
            order: log.order != null ? {
                id: log.order.id,
                trader: log.order.trader.value,
                base_token: log.order.base_token.value,
                base_size: (log.order.base_size.negative ? "-" : "") + log.order.base_size.value.toString(),
                base_price: log.order.order_price.toString(),
            } : null
        }
    }
}
