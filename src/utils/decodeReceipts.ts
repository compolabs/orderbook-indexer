import BN from "./BN";
import { Contract, getDecodedLogs, TransactionResultReceipt } from "fuels";

export function decodeReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract,
  decoders: any[]
): any[] {
  try {
    const logs = getDecodedLogs(receipts, abi.interface);
    const decodedLogs = logs.map((log: any) => {
      for (let i = 0; i < decoders.length; i++) {
        const result = decoders[i](log, abi);
        if (result != null) return result;
      }
    });
    return decodedLogs
      .filter((e) => e !== undefined)
      .sort((a: any, b: any) => {
        if ((a.timestamp == null && b.timestamp == null) || a.timestamp === b.timestamp) return 0;
        return new BN(a.timestamp).gt(b.timestamp) ? 1 : -1;
      });
  } catch (e) {
    // console.error(e, receipts)
    return [];
  }
}
