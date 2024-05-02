import {Contract, getDecodedLogs, TransactionResultReceipt} from "fuels";
import isEvent from "../utils/isEvent";
import BN from "../utils/BN";
import tai64ToDate from "../utils/tai64ToDate";


export function decodeProxyReceipts(receipts: TransactionResultReceipt[], abi: Contract) {
    try {
        const logs = getDecodedLogs(receipts, abi.interface)
        const decodedLogs = logs.map((log: any) => {
            if (isEvent("CreateOrderEvent", log, abi)) {
                return {
                    predicate_root: log.predicate_root.value,
                    maker: log.maker.Address.value,
                    price: log.price.toString(),
                    base_asset: log.base_asset.value,
                    quote_asset: log.quote_asset.value,
                    base_amount: log.base_amount.toString(),
                    order_type: log.order_type,
                    min_fulfill_base_amount: log.min_fulfill_base_amount?.toString(),
                }
            }

        })
        return decodedLogs
            .filter(e => e !== undefined)
        // .sort((a: any, b: any) => new BN(a.timestamp).gt(b.timestamp) ? 1 : -1)
    } catch (e) {
        console.error(e, receipts)
        return []
    }
}

