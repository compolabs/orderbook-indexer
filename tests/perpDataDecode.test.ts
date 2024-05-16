import { describe, it } from "@jest/globals";

import { readFileSync } from "fs";
import fetchReceiptsFromEnvio from "../src/utils/fetchReceiptsFromEnvio";
import { PRIVATE_KEY } from "../src/config";
import { decodeClearingHouseReceipts } from "../src/decoders/decodeClearingHouseReceipts";
import { decodeAccountBalanceReceipts } from "../src/decoders/decodeAccountBalanceReceipts";
import {
  BETA_NETWORK,
  ClearingHouseAbi__factory,
  AccountBalanceAbi__factory,
} from "@compolabs/spark-ts-sdk";
import { WalletUnlocked, Provider, Wallet } from "fuels";

describe("Envio indexer data encode test", () => {
  let wallet: WalletUnlocked;

  beforeEach(async () => {
    const provider = await Provider.create(BETA_NETWORK.url);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);
  });

  it("should decode clearing house data", async () => {
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
    const { accountBalance: contractId, blockNumber } = JSON.parse(
      readFileSync("./tests/perpAddresses.json").toString()
    );

    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, blockNumber + 1000, [
      contractId,
    ]);
    const accountBalanceAbi = AccountBalanceAbi__factory.connect(contractId, wallet);
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
