import {Contract, TransactionResultReceipt} from "fuels";
import {decodeReceipts} from "../utils/decodeReceipts";
import {ClearingHouseAbi} from "../sdk/blockchain/fuel/types/clearing-house";
import isEvent from "../utils/isEvent";

export function decodeClearingHouseReceipts(receipts: TransactionResultReceipt[], abi: Contract): any[] {
    const clearingHouseDecoders = [decodeMarketEvent]
    return decodeReceipts(receipts, abi, clearingHouseDecoders)
}

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
