import {Nullable} from "tsdef";
import axios from "axios";
import {TransactionResultReceipt} from "fuels";
import {BN} from "@fuel-ts/math";
import {ReceiptLogData} from "@fuel-ts/transactions/dist/coders/receipt";

type TGetReceiptsResult = {
    archiveHeight: number,
    nextBlock: number,
    receipts: Array<TransactionResultReceipt>
}

export default async function fetchReceiptsFromEnvio(fromBlock: number, toBlock: number, contractId: string,): Promise<Nullable<TGetReceiptsResult>> {
    const request = {
        "from_block": fromBlock,
        "to_block": toBlock,
        "receipts": [
            {"contract_id": [contractId], "receipt_type": [6]},
            {"root_contract_id": [contractId], "receipt_type": [6]}
        ],
        "field_selection": {"receipt": ["receipt_type", "contract_id", "ra", "rb", "ptr", "len", "digest", "pc", "is", "data", "root_contract_id"]}
    }
    const indexerData = await axios.post("https://fuel-next.hypersync.xyz/query", request).then(response => response.data);
    const rawReceipts = (indexerData as any).data.flatMap(({ receipts }: any) => receipts.filter(({ receipt_type }: any) => receipt_type == 6))
    const receipts: TransactionResultReceipt[] = rawReceipts.map((receipt: any) => ({
        type: receipt.receipt_type,
        id: receipt.contract_id,
        val0: new BN(receipt.ra),
        val1: new BN(receipt.rb),
        ptr: new BN(receipt.ptr),
        len: new BN(receipt.len),
        digest: receipt.digest,
        pc: new BN(receipt.pc),
        is: new BN(receipt.is),
        data: receipt.data
    } as ReceiptLogData & { data: string }))

    return {
        archiveHeight: indexerData.archive_height,
        nextBlock: indexerData.next_block,
        receipts
    }
}
