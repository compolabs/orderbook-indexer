import { beforeEach, describe, it } from "@jest/globals";
import { BaseAssetId, ContractFactory, Provider, Wallet, WalletUnlocked, sleep } from "fuels";

import { readFileSync } from "fs";
import { PRIVATE_KEY } from "../src/config";
import fetchReceiptsFromEnvio from "../src/utils/fetchReceiptsFromEnvio";
import { decodeOrderbookReceipts } from "../src/decoders/decodeOrderbookReceipts";
import Spark, {
  BETA_NETWORK,
  BETA_CONTRACT_ADDRESSES,
  BETA_INDEXER_URL,
  OrderbookAbi__factory,
  BN,
} from "@compolabs/spark-ts-sdk";
import { TOKENS_BY_SYMBOL } from "../src/constants";
import { AssetIdInput } from "@compolabs/spark-ts-sdk/dist/types/orderbook/OrderbookAbi";

describe("Envio indexer data encode test", () => {
  let wallet: WalletUnlocked;
  let spark: Spark;

  let blockNumber: number;
  let contractId: string;

  beforeEach(async () => {
    const provider = await Provider.create(BETA_NETWORK.url);
    wallet = Wallet.fromPrivateKey(PRIVATE_KEY, provider);

    spark = new Spark({
      networkUrl: BETA_NETWORK.url,
      contractAddresses: BETA_CONTRACT_ADDRESSES,
      indexerApiUrl: BETA_INDEXER_URL,
      wallet,
    });
  });

  it("should emit and decode data", async () => {
    const sellSize = 4414;
    const sellPrice = 62329750000000;
    const buySize = 18812;
    const buyPrice = 63649539999990;

    const eth = TOKENS_BY_SYMBOL["ETH"];
    const balance = await spark.fetchWalletBalance(eth);

    console.log("Wallet address: ", wallet.address);
    console.log("Eth balance   : ", balance, " ETH");

    const byteCode = readFileSync(`./contract/out/debug/orderbook.bin`);
    const abi = JSON.parse(readFileSync(`./contract/out/debug/orderbook-abi.json`, "utf8"));

    const orderbookFactory = new ContractFactory(byteCode, abi, wallet);
    const { minGasPrice: gasPrice } = wallet.provider.getGasConfig();

    const btc = TOKENS_BY_SYMBOL["BTC"];
    const usdc = TOKENS_BY_SYMBOL["USDC"];

    const configurableConstants = {
      QUOTE_TOKEN: { value: usdc.address },
      QUOTE_TOKEN_DECIMALS: 6,
      PRICE_DECIMALS: 9,
    };
    const contract = await orderbookFactory.deployContract({ gasPrice, configurableConstants });

    blockNumber = await wallet.provider.getBlockNumber().then((res) => res.toNumber());
    contractId = contract.id.toHexString();

    console.log("Current", { contractId, blockNumber });

    const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);

    const btcAssetId: AssetIdInput = {
      value: btc.address,
    };

    await orderbookAbi.functions.create_market(btcAssetId, 8);

    console.log("Market created: ", btc.address);
    await spark.mintToken(btc, String(sellSize));
    console.log(`${sellSize / 1e8} btc Token minted`);
    const { value: sellOrderId } = await spark.createSpotOrder(
      btc,
      usdc,
      "-" + sellSize.toString(),
      sellPrice.toString()
    );
    console.log({ sellOrderId });

    const usdcAmount = Math.ceil(
      new BN(buySize).times(buySize).div(1e8).div(1e8).times(1e6).toNumber()
    );
    await spark.mintToken(usdc, String(usdcAmount));
    console.log(`${usdcAmount / 1e6} USDC Token minted`);
    const { value: buyOrderId } = await spark.createSpotOrder(
      btc,
      usdc,
      buySize.toString(),
      buyPrice.toString()
    );

    await sleep(1000);
    const sellOrder = await spark.fetchSpotOrderById(sellOrderId as string);
    const buyOrder = await spark.fetchSpotOrderById(buyOrderId as string);
    console.log({ sellOrder, buyOrder });

    await spark
      .matchSpotOrders(sellOrderId as string, buyOrderId as string)
      .catch((e) => console.error(e.cause.logs));
    console.log("Orders matched");
    await sleep(1000);

    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, +blockNumber + 1000, [
      contractId,
    ]);

    if (!receiptsResult) {
      throw new Error("Receipt is undefined");
    }

    const events = decodeOrderbookReceipts(receiptsResult.receipts, orderbookAbi);
    console.log(events);
  }, 60_000);
  it("match orders", async () => {
    const sellOrderId = "0x4d8e67903374b36c22fcf0fb07bd9a9060a9fbae37fd2c2a8f478335c9363ed8";
    const buyOrderId = "0x4285de56c7b84da6417f5bae151087b0dc8aa9b2746feed34d968d2d09fca62a";

    const sellOrder = await spark.fetchSpotOrderById(sellOrderId);
    const buyOrder = await spark.fetchSpotOrderById(buyOrderId);
    console.log({ sellOrder, buyOrder });

    await spark
      .matchSpotOrders(sellOrderId, buyOrderId)
      .then(() => console.log("Orders matched"))
      .catch((e: any) => console.error(e));
  }, 60_000);

  it("should create and cancel order", async () => {
    console.log("Wallet address: ", wallet.address);
    console.log(
      "Eth balance   : ",
      await wallet.getBalance(BaseAssetId).then((b) => b.toString()),
      " ETH"
    );

    const btc = TOKENS_BY_SYMBOL["BTC"];
    const usdc = TOKENS_BY_SYMBOL["USDC"];
    await spark.mintToken(btc, String(0.001 * 1e8));
    console.log(`0.001 btc Token minted`);

    const { value: sellOrderId } = await spark.createSpotOrder(
      btc,
      usdc,
      "-100000",
      (69111 * 1e9).toString()
    );
    console.log({ sellOrderId });
    await spark.cancelSpotOrder(sellOrderId as string);
  }, 60_000);

  it("should decode data", async () => {
    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, blockNumber + 5000, [
      contractId,
    ]);

    const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);
    if (receiptsResult === null) return;

    console.log(decodeOrderbookReceipts(receiptsResult.receipts, orderbookAbi));
  }, 60_000);
});
