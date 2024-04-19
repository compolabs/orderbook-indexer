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
        const event: any = decodedEvents[eventIndex];

        console.log(event);
        if (isEvent("MarketCreateEvent", event, abi)) {
            await MarketCreateEvent.create({...event});
        } else if (isEvent("OrderChangeEvent", event, abi)) {
            await OrderChangeEvent.create({
                order_id: event.order_id,
                new_base_size: event.order?.base_size ?? "0", timestamp: event.timestamp
            });
            const defaultOrder: any = event.order === null ? null : {
                order_id: event.order_id,
                trader: event.order.trader,
                base_token: event.order.base_token,
                base_size: event.order.base_size,
                base_price: event.order.base_price,
                timestamp: event.timestamp
            }
            const [order, created] = await Order.findOrCreate({
                where: {order_id: (event as any).order_id},
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
