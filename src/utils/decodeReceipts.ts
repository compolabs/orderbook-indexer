import {ClearingHouseAbi} from "../sdk/blockchain/fuel/types/clearing-house";
import {AccountBalanceAbi} from "../sdk/blockchain/fuel/types/account-balance";
import BN from "./BN";
import {Contract, getDecodedLogs, TransactionResultReceipt} from "fuels";
import isEvent from "./isEvent";
import {PerpMarketAbi} from "../sdk/blockchain/fuel/types/perp-market";

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
export type TDecodedOrderbookEvent = TMarketCreateEvent
    | TOrderChangeEvent
    | TTradeEvent

export function decodeOrderbookReceipts(receipts: TransactionResultReceipt[], abi: Contract): TDecodedOrderbookEvent[] {
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
                    timestamp: log.timestamp.toString(),
                    order: log.order != null ? {
                        id: log.order.id,
                        trader: log.order.trader.value,
                        base_token: log.order.base_token.value,
                        base_size: (log.order.base_size.negative ? "-" : "") + log.order.base_size.value.toString(),
                        base_price: log.order.base_price.toString(),
                    } : null,
                } as any;
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
        return decodedLogs
            .filter(e => e !== undefined)
            .sort((a: any, b: any) => new BN(a.timestamp).gt(b.timestamp) ? 1 : -1) as TDecodedOrderbookEvent[]
    } catch (e) {
        console.error(e, receipts)
        return []
    }
}


// const decodeMarketCreateEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("MarketCreateEvent", log, abi)) {
//         return {
//             eventName: "MarketCreateEvent",
//
//             base_token: log.base_token.value,
//             decimal: log.decimal.toString(),
//             price_feed: log.price_feed,
//             im_ratio: log.im_ratio.toString(),
//             mm_ratio: log.mm_ratio.toString(),
//             initial_price: log.initial_price.toString(),
//             sender: log.sender.value,
//         }
//     }
// }
// const decodeMarketCloseEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("MarketCloseEvent", log, abi)) {
//         return {
//             eventName: "MarketCloseEvent",
//
//             base_token: log.base_token.value,
//             close_price: log.close_price.toString(),
//             sender: log.sender.value,
//         }
//     }
// }
// const decodeMarketPauseEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("MarketPauseEvent", log, abi)) {
//         return {
//             eventName: "MarketPauseEvent",
//
//             base_token: log.base_token.value,
//             market_price: log.market_price.toString(),
//             sender: log.sender.value,
//             paused: log.paused
//         }
//     }
// }
//
// const decodeOrderOpenEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("OrderOpenEvent", log, abi)) {
//         return {
//             eventName: "OrderOpenEvent",
//
//             base_token: log.base_token.value,
//             base_size: (log.base_size.negative ? "-" : "") + log.base_size.value.toString(),
//             order_price: log.order_price.toString(),
//             market_price: log.market_price.toString(),
//             sender: log.sender.value,
//         }
//     }
// }
// const decodeOrderRemoveUncollaterizedEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("OrderRemoveUncollaterizedEvent", log, abi)) {
//         return {
//             eventName: "OrderRemoveUncollaterizedEvent",
//
//             trader: log.trader.value,
//             orders: log.orders,
//             sender: log.sender.value,
//         }
//     }
// }
// const decodeOrderRemoveEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("OrderRemoveEvent", log, abi)) {
//         return {
//             eventName: "OrderRemoveEvent",
//
//             trader: log.trader.value,
//             order: log.order,
//         }
//     }
// }
// const decodeOrderRemoveAllEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("OrderRemoveAllEvent", log, abi)) {
//         return {
//             eventName: "OrderRemoveAllEvent",
//             trader: log.trader.value,
//             orders: log.orders,
//         }
//     }
// }
// const decodeOrderMatchEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("OrderMatchEvent", log, abi)) {
//         return {
//             eventName: "OrderMatchEvent",
//
//
//             order_sell_id: log.order_sell_id,
//             order_buy_id: log.order_buy_id,
//             trader_sell: log.trader_sell.value,
//             trader_buy: log.trader_buy.value,
//             base_token: log.base_token.value,
//             trade_amount: log.trade_amount.toString(),
//             trade_value: log.trade_value.toString(),
//             fee_seller: (log.fee_seller.negative ? "-" : "") + log.fee_seller.value.toString(),
//             fee_buyer: (log.fee_buyer.negative ? "-" : "") + log.fee_buyer.value.toString(),
//             matcher: log.matcher.value
//         }
//     }
// }
// const decodeOrderFulfillEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("OrderFulfillEvent", log, abi)) {
//         return {
//             eventName: "OrderFulfillEvent",
//             order_id: log.order_id,
//             trader_sell: log.trader_sell.value,
//             trader_buy: log.trader_buy.value,
//             base_token: log.base_token.value,
//             trade_amount: log.trade_amount.toString(),
//             trade_value: log.trade_value.toString(),
//             fee_seller: (log.fee_seller.negative ? "-" : "") + log.fee_seller.value.toString(),
//             fee_buyer: (log.fee_buyer.negative ? "-" : "") + log.fee_buyer.value.toString(),
//             matcher: log.matcher.value,
//
//
//         }
//     }
// }
// const decodeTraderSettleAllFunding = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("TraderSettleAllFunding", log, abi)) {
//         return {
//             eventName: "TraderSettleAllFunding",
//             trader: log.trader.value,
//             sender: log.sender.value,
//         }
//     }
// }
// const decodeTraderPositionLiquidateEvent = (log: any, abi: ClearingHouseAbi) => {
//     if (isEvent("TraderPositionLiquidateEvent", log, abi)) {
//         return {
//             eventName: "TraderPositionLiquidateEvent",
//
//             trader: log.trader.value,
//             base_token: log.base_token.value,
//             position_size_to_be_liquidated: (log.position_size_to_be_liquidated.negative ? "-" : "") + log.position_size_to_be_liquidated.value.toString(),
//             liquidated_position_size: (log.liquidated_position_size.negative ? "-" : "") + log.liquidated_position_size.value.toString(),
//             liquidation_penalty: log.liquidation_penalty.toString(),
//             liquidation_fee_to_liquidator: log.liquidation_fee_to_liquidator.toString(),
//             liquidator: log.liquidator.value,
//         }
//     }
// }


const decodeMarketEvent = (log: any, abi: ClearingHouseAbi) => {
    if (isEvent("MarketEvent", log, abi)) {
        return {
            eventName: "MarketEvent",

            sender: log.sender.Address.value,
            timestamp: log.timestamp.toString(),
            identifier: log.identifier,
            market: {
                asset_id: log.market.asset_id.value, //AssetId,
                decimal: log.market.decimal.toString(), //u32,
                price_feed: log.market.price_feed, //b256,
                im_ratio: log.market.im_ratio.toString(), //u64,
                mm_ratio: log.market.mm_ratio.toString(), //u64,
                status: log.market.status.toString(), //MarketStatus,
                paused_index_price: log.market.paused_index_price?.toString(), //Option<u64>,
                paused_timestamp: log.market.paused_timestamp?.toString(), //Option<u64>,
                closed_price: log.market.closed_price?.toString(), //Option<u64>,

            },
        }
    }
}

const clearingHouseDecoders = [
    decodeMarketEvent,
]

const decodeAccountBalanceChangeEvent = (log: any, abi: AccountBalanceAbi) => {
    if (isEvent("AccountBalanceChangeEvent", log, abi)) {
        return {
            eventName: "AccountBalanceChangeEvent",

            trader: log.trader.value,
            base_token: log.base_token.value,
            account_balance: {
                taker_position_size: (log.account_balance.taker_position_size.negative ? "-" : "") + log.account_balance.taker_position_size.value.toString(),
                taker_open_notional: (log.account_balance.taker_open_notional.negative ? "-" : "") + log.account_balance.taker_open_notional.value.toString(),
                last_tw_premium_growth_global: (log.account_balance.last_tw_premium_growth_global.negative ? "-" : "") + log.account_balance.last_tw_premium_growth_global.value.toString(),
            },
        }
    }
}

const accountBalanceDecoders = [decodeAccountBalanceChangeEvent]

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
            timestamp: log.timestamp.toString(),

        }
    }
}

const decodeOrderEvent = (log: any, abi: PerpMarketAbi) => {
    if (isEvent("OrderEvent", log, abi)) {
        return {
            eventName: "OrderEvent",

            order_id: log.order_id,
            sender: log.sender?.Address?.value ?? log.sender?.ContractId?.value ,
            timestamp: log.timestamp.toString(),
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

const perpMarketDecoders = [decodeTradeEvent,decodeOrderEvent]

export function decodeAccountBalanceReceipts(receipts: TransactionResultReceipt[], abi: Contract): any[] {
    return decodeReceipts(receipts, abi, accountBalanceDecoders)
}

export function decodeClearingHouseReceipts(receipts: TransactionResultReceipt[], abi: Contract): any[] {
    return decodeReceipts(receipts, abi, clearingHouseDecoders)
}

export function decodePerpMarketReceipts(receipts: TransactionResultReceipt[], abi: Contract): any[] {
    return decodeReceipts(receipts, abi, perpMarketDecoders)
}

export function decodeReceipts(receipts: TransactionResultReceipt[], abi: Contract, decoders: any[]): any[] {
    try {
        const logs = getDecodedLogs(receipts, abi.interface)
        const decodedLogs = logs.map((log: any) => {
            for (let i = 0; i < decoders.length; i++) {
                const result = decoders[i](log, abi);
                if (result != null) return result
            }
        })
        return decodedLogs
            .filter(e => e !== undefined)
            .sort((a: any, b: any) => {
                if (a.timestamp == null && b.timestamp == null || (a.timestamp === b.timestamp)) return 0
                return new BN(a.timestamp).gt(b.timestamp) ? 1 : -1
            })
    } catch (e) {
        // console.error(e, receipts)
        return []
    }
}
