import MarketCreateEvent from "../models/spotMarketCreateEvent";
import SpotOrderChangeEvent from "../models/spotOrderChangeEvent";
import SpotOrder from "../models/spotOrder";
import TradeEvent from "../models/spotTradeEvent";
import isEvent from "../utils/isEvent";
import {Contract, TransactionResultReceipt} from "fuels";
import {decodeOrderbookReceipts} from "../decoders/decodeOrderbookReceipts";
import {decodeProxyReceipts} from "../decoders/decodeProxyReceipts";

export async function handleProxyReceipts(receipts: TransactionResultReceipt[], abi: Contract) {
    const decodedEvents = decodeProxyReceipts(receipts, abi)
    //     .sort((a, b) => {
    //     if (+a.timestamp < +b.timestamp) return -1;
    //     if (+a.timestamp > +b.timestamp) return 1;
    //     return 0;
    // });
    for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
        const event: any = decodedEvents[eventIndex];

        console.log(event);
        //todo
        // if (isEvent("MarketCreateEvent", event, abi)) {
        //     await MarketCreateEvent.create({...event});
        // } else if (isEvent("OrderChangeEvent", event, abi)) {
        //     await SpotOrderChangeEvent.create({
        //         order_id: event.order_id,
        //         new_base_size: event.order?.base_size ?? "0", timestamp: event.timestamp
        //     });
        //     const defaultOrder: any = event.order === null ? null : {
        //         order_id: event.order_id,
        //         trader: event.order.trader,
        //         base_token: event.order.base_token,
        //         base_size: event.order.base_size,
        //         base_price: event.order.base_price,
        //         timestamp: event.timestamp
        //     }
        //     const [order, created] = await SpotOrder.findOrCreate({
        //         where: {order_id: (event as any).order_id},
        //         defaults: defaultOrder,
        //     });
        //
        //     if (!created) {
        //         await order.set("base_size", defaultOrder == null ? "0" : defaultOrder.base_size).save();
        //     }
        // } else if (isEvent("TradeEvent", event, abi)) {
        //     await TradeEvent.create(event);
        // } else {
        //     console.log("Unknown event", event);
        // }
    }
}
