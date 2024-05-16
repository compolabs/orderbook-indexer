import { Contract, getDecodedLogs, TransactionResultReceipt } from "fuels";

export function decodeReceipts(
  receipts: TransactionResultReceipt[],
  abi: Contract,
  decoders: any[]
): any[] {
  try {
    const logs = getDecodedLogs(receipts, abi.interface.jsonAbi);
    const decodedLogs = logs.map((log: any) => {
      for (let i = 0; i < decoders.length; i++) {
        const result = decoders[i](log, abi);
        if (result != null) return result;
      }
    });
    return decodedLogs.filter((e) => e !== undefined);
  } catch (e) {
    // console.error(e, receipts)
    return [];
  }
}
