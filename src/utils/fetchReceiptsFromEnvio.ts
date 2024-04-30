import { Nullable } from "tsdef";
import axios from "axios";
import { TransactionResultReceipt } from "fuels";
import { BN } from "@fuel-ts/math";
import { ReceiptLogData } from "@fuel-ts/transactions/dist/coders/receipt";

type TGetReceiptsResult = {
  archiveHeight: number;
  nextBlock: number;
  receipts: Array<TransactionResultReceipt>;
};

export default async function fetchReceiptsFromEnvio(
  fromBlock: number,
  toBlock: number,
  contracts: string[]
): Promise<Nullable<TGetReceiptsResult>> {
  const request = {
    from_block: fromBlock,
    to_block: toBlock,
    receipts: [
      { contract_id: contracts, receipt_type: [6] },
      { root_contract_id: contracts, receipt_type: [6] },
    ],
    field_selection: {
      transaction: ["id", "status"],
      receipt: [
        "tx_id",
        "receipt_type",
        "contract_id",
        "ra",
        "rb",
        "ptr",
        "len",
        "digest",
        "pc",
        "is",
        "data",
        "root_contract_id",
      ],
    },
  };
  const indexerData = await axios
    .post("https://fuel-15.hypersync.xyz/query", request)
    .then((response) => response.data);
  const rawReceipts = (indexerData as any).data.flatMap(({ receipts }: any) =>
    receipts.filter(({ receipt_type }: any) => receipt_type == 6)
  );
  const failedTxIds = (indexerData as any).data.flatMap(({ transactions }: any) =>
    transactions.filter(({ status }: any) => status != 3).map(({ id }: any) => id)
  );
  const receipts: TransactionResultReceipt[] = rawReceipts
    .filter((receipt: any) => failedTxIds.includes(receipt.tx_id))
    .map(
      (receipt: any) =>
        ({
          type: receipt.receipt_type,
          tx_id: receipt.tx_id,
          id: receipt.contract_id,
          val0: new BN(receipt.ra),
          val1: new BN(receipt.rb),
          ptr: new BN(receipt.ptr),
          len: new BN(receipt.len),
          digest: receipt.digest,
          pc: new BN(receipt.pc),
          is: new BN(receipt.is),
          data: receipt.data,
          contract_id: receipt.contract_id ?? receipt.root_contract_id,
        } as ReceiptLogData & { data: string })
    );

  return {
    archiveHeight: indexerData.archive_height,
    nextBlock: indexerData.next_block,
    receipts,
  };
}
