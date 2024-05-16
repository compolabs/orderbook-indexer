import { Contract, TransactionResultReceipt } from "fuels";
import { decodeAccountBalanceReceipts } from "../decoders/decodeAccountBalanceReceipts";
import PerpPosition from "../models/perpPosition";
import isEvent from "../utils/isEvent";

export async function handleAccountBalanceReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract
) {
  const decodedEvents = decodeAccountBalanceReceipts(receipts, abi);
  for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
    const event = decodedEvents[eventIndex];

    console.log(event);
    if (isEvent("AccountBalanceChangeEvent", event, abi)) {
      const defaults = {
        trader: event.trader,
        base_token: event.base_token,
        taker_position_size: event.account_balance.taker_position_size,
        taker_open_notional: event.account_balance.taker_open_notional,
        last_tw_premium_growth_global: event.account_balance.last_tw_premium_growth_global,
      };
      const [position, created] = await PerpPosition.findOrCreate({
        where: {
          trader: event.trader,
          base_token: event.base_token,
        },
        defaults,
      });
      if (!created) {
        await position.set("taker_position_size", defaults.taker_position_size).save();
        await position.set("taker_open_notional", defaults.taker_open_notional).save();
        await position
          .set("last_tw_premium_growth_global", defaults.last_tw_premium_growth_global)
          .save();
      }
    }
  }
}
