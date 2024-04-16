import {decodeAccountBalanceReceipts} from "../utils/decodeReceipts";
import {Contract, TransactionResultReceipt} from "fuels";

export async function handleAccountBalanceReceipts(receipts: TransactionResultReceipt[], abi: Contract) {
    const decodedEvents = decodeAccountBalanceReceipts(receipts, abi);
    for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
        const event = decodedEvents[eventIndex];

        console.log(event);
       //todo
    }
}
