import {decodeClearingHouseReceipts} from "../utils/decodeReceipts";
import {Contract, TransactionResultReceipt} from "fuels";

export async function handleClearingHouseReceipts(receipts: TransactionResultReceipt[], abi: Contract) {
    const decodedEvents = decodeClearingHouseReceipts(receipts, abi);
    for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
        const event = decodedEvents[eventIndex];

        console.log(event);
        //todo
    }
}
