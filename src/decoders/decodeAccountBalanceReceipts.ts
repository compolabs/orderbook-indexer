import { Contract, TransactionResultReceipt } from "fuels";
import { decodeReceipts } from "../utils/decodeReceipts";
import isEvent from "../utils/isEvent";
import tai64ToDate from "../utils/tai64ToDate";
import { AccountBalanceAbi } from "@compolabs/spark-ts-sdk";

export function decodeAccountBalanceReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract
): any[] {
  const accountBalanceDecoders = [decodeAccountBalanceChangeEvent];

  return decodeReceipts(receipts, abi, accountBalanceDecoders);
}

const decodeAccountBalanceChangeEvent = (log: any, abi: AccountBalanceAbi) => {
  if (isEvent("AccountBalanceChangeEvent", log, abi)) {
    return {
      eventName: "AccountBalanceChangeEvent",

      trader: log.trader.value,
      base_token: log.base_token.value,
      timestamp: tai64ToDate(log.timestamp.toString()),
      account_balance: {
        taker_position_size:
          (log.account_balance.taker_position_size.negative ? "-" : "") +
          log.account_balance.taker_position_size.value.toString(),
        taker_open_notional:
          (log.account_balance.taker_open_notional.negative ? "-" : "") +
          log.account_balance.taker_open_notional.value.toString(),
        last_tw_premium_growth_global:
          (log.account_balance.last_tw_premium_growth_global.negative ? "-" : "") +
          log.account_balance.last_tw_premium_growth_global.value.toString(),
      },
    };
  }
};
