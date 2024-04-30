import { Contract, TransactionResultReceipt } from "fuels";
import { decodeClearingHouseReceipts } from "../decoders/decodeClearingHouseReceipts";
import isEvent from "../utils/isEvent";
import PerpMarketEvent from "../models/perpMarketEvent";
import PerpMarket from "../models/perpMarket";

export async function handleClearingHouseReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract
) {
  const decodedEvents = decodeClearingHouseReceipts(receipts, abi);
  for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
    const event = decodedEvents[eventIndex];

    console.log(event);
    if (isEvent("MarketEvent", event, abi)) {
      await PerpMarket.create({ ...event.market });
    }
  }
}
