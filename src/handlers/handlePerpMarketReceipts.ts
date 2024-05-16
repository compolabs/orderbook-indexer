import { Contract, TransactionResultReceipt } from "fuels";
import { decodePerpMarketReceipts } from "../decoders/decodePerpMarketReceipts";
import isEvent from "../utils/isEvent";
import TradeEvent from "../models/perpTradeEvent";
import PerpOrderModel from "../models/perpOrder";

export async function handlePerpMarketReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract
) {
  const decodedEvents = decodePerpMarketReceipts(receipts, abi);
  for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
    const event = decodedEvents[eventIndex];

    console.log(event);
    if (isEvent("OrderEvent", event, abi)) {
      const defaultOrder: any =
        event.order === null
          ? null
          : {
              order_id: event.order_id,
              trader: event.order.trader,
              base_token: event.order.base_token,
              base_size: event.order.base_size,
              base_price: event.order.base_price,
              timestamp: event.timestamp,
            };
      const [order, created] = await PerpOrderModel.findOrCreate({
        where: { order_id: (event as any).order_id },
        defaults: defaultOrder,
      });

      if (!created) {
        await order.set("base_size", defaultOrder == null ? "0" : defaultOrder.base_size).save();
      }
    } else if (isEvent("TradeEvent", event, abi)) {
      await TradeEvent.create(event);
    } else {
      console.log("Unknown event", event);
    }
  }
}
