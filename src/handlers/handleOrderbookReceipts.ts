import MarketCreateEvent from "../models/marketCreateEvent";
import OrderChangeEvent from "../models/orderChangeEvent";
import Order from "../models/order";
import BN from "../utils/BN";
import TradeEvent from "../models/tradeEvent";
import {decodeOrderbookReceipts, TDecodedOrderbookEvent} from "../utils/decodeReceipts";
import isEvent from "../utils/isEvent";
import {Contract, TransactionResultReceipt} from "fuels";

export async function handleOrderbookReceipts(receipts: TransactionResultReceipt[], abi: Contract) {
    const decodedEvents = decodeOrderbookReceipts(receipts, abi);
    for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
        const event = decodedEvents[eventIndex];

        console.log(event);
        if (isEvent("MarketCreateEvent", event, abi)) {
            await MarketCreateEvent.create({...event});
        } else if (isEvent("OrderChangeEvent", event, abi)) {
            await OrderChangeEvent.create(event);
            const defaults: any = {...event, base_size: (event as any).base_size_change};
            delete defaults.base_size_change;
            const [order, created] = await Order.findOrCreate({
                where: {order_id: (event as any).order_id},
                defaults,
            });

            if (!created) {
                const baseSizeChange = new BN((event as any).base_size_change);
                const baseSize = new BN(order.get("base_size") as string);
                await order.set("base_size", baseSize.plus(baseSizeChange).toString()).save();
            }
        } else if (isEvent("TradeEvent", event, abi)) {
            await TradeEvent.create(event);
        } else {
            console.log("Unknown event", event);
        }
    }
}
