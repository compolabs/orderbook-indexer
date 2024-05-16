import { Contract, getDecodedLogs, TransactionResultReceipt } from "fuels";
import isEvent from "../utils/isEvent";
import tai64ToDate from "../utils/tai64ToDate";
import { BN } from "@compolabs/spark-ts-sdk";

type TMarketCreateEvent = {
  asset_id: string;
  asset_decimals: number;
  timestamp: string;
};
type TOrderChangeEvent = {
  order_id: string;
  trader: string;
  base_token: string;
  base_size_change: string;
  base_price: string;
  timestamp: string;
};
type TTradeEvent = {
  base_token: string;
  order_matcher: string;
  seller: string;
  buyer: string;
  trade_size: string;
  trade_price: string;
  timestamp: string;
};
export type TDecodedOrderbookEvent = TMarketCreateEvent | TOrderChangeEvent | TTradeEvent;

export function decodeOrderbookReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract
): TDecodedOrderbookEvent[] {
  try {
    const logs = getDecodedLogs(receipts, abi.interface.jsonAbi);
    const decodedLogs = logs.map((log: any) => {
      // MarketCreateEvent
      if (isEvent("MarketCreateEvent", log, abi)) {
        return {
          asset_id: log.asset_id.value,
          asset_decimals: log.asset_decimals,
          timestamp: tai64ToDate(log.timestamp.toString()),
          tx_id: log.tx_id,
        } as any;
      }
      // OrderChangeEvent
      if (isEvent("OrderChangeEvent", log, abi)) {
        return {
          order_id: log.order_id,
          timestamp: tai64ToDate(log.timestamp.toString()),
          tx_id: log.tx_id,
          identifier: log.identifier,
          sender: log.sender.Address.value,
          order:
            log.order != null
              ? {
                  id: log.order.id,
                  trader: log.order.trader.value,
                  base_token: log.order.base_token.value,
                  base_size:
                    (log.order.base_size.negative ? "-" : "") +
                    log.order.base_size.value.toString(),
                  base_price: log.order.base_price.toString(),
                }
              : null,
        } as any;
      }
      // TradeEvent
      if (isEvent("TradeEvent", log, abi)) {
        return {
          tx_id: log.tx_id,
          base_token: log.base_token.value,
          order_matcher: log.order_matcher.value,
          seller: log.seller.value,
          buyer: log.buyer.value,
          trade_size: log.trade_size.toString(),
          trade_price: log.trade_price.toString(),
          sell_order_id: log.sell_order_id,
          buy_order_id: log.buy_order_id,
          timestamp: tai64ToDate(log.timestamp.toString()),
        } as any;
      }
    });
    return decodedLogs.filter((e) => e !== undefined);
  } catch (e) {
    console.error(e, receipts);
    return [];
  }
}
