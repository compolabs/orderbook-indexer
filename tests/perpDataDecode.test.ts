import { describe, it } from "@jest/globals";

import { readFileSync } from "fs";
import { FuelNetwork } from "../src/sdk/blockchain";
import fetchReceiptsFromEnvio from "../src/utils/fetchReceiptsFromEnvio";
import { ClearingHouseAbi__factory } from "../src/sdk/blockchain/fuel/types/clearing-house";
import { PRIVATE_KEY } from "../src/config";
import { AccountBalanceAbi__factory } from "../src/sdk/blockchain/fuel/types/account-balance";
import { decodeClearingHouseReceipts } from "../src/decoders/decodeClearingHouseReceipts";
import { decodeAccountBalanceReceipts } from "../src/decoders/decodeAccountBalanceReceipts";

describe("Envio indexer data encode test", () => {
  let fuelNetwork: FuelNetwork;

  beforeEach(async () => {
    fuelNetwork = new FuelNetwork();
    await fuelNetwork.connectWalletByPrivateKey(PRIVATE_KEY);
  });

  it("should decode clearing house data", async () => {
    const wallet = fuelNetwork.walletManager.wallet!;
    const { clearingHouse: contractId, blockNumber } = JSON.parse(
      readFileSync("./tests/perpAddresses.json").toString()
    );

    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, blockNumber + 1000, [
      contractId,
    ]);
    const clearingHouseAbi = ClearingHouseAbi__factory.connect(contractId, wallet);
    if (receiptsResult === null) return;

    for (let i = 0; i < receiptsResult.receipts.length; i++) {
      try {
        const clearingHouseEvents = decodeClearingHouseReceipts(
          [receiptsResult.receipts[i]],
          clearingHouseAbi
        );
        clearingHouseEvents.length > 0 && console.log(clearingHouseEvents[0]);
      } catch (e) {
        console.error(e, receiptsResult.receipts[i]);
      }
    }
  }, 60_000);

  it("should decode account balance data", async () => {
    const wallet = fuelNetwork.walletManager.wallet!;
    const { accountBalance: contractId, blockNumber } = JSON.parse(
      readFileSync("./tests/perpAddresses.json").toString()
    );

    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, blockNumber + 1000, [
      contractId,
    ]);
    const accountBalanceAbi = AccountBalanceAbi__factory.connect(contractId, wallet);
    // console.log(receiptsResult)
    if (receiptsResult === null) return;

    for (let i = 0; i < receiptsResult.receipts.length; i++) {
      try {
        const events = decodeAccountBalanceReceipts(
          [receiptsResult.receipts[i]],
          accountBalanceAbi
        );
        events.length > 0 && console.log(events[0]);
      } catch (e) {
        console.error(e, receiptsResult.receipts[i]);
      }
    }
  }, 60_000);
});
