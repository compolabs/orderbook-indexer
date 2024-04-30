import { beforeEach, describe, it } from "@jest/globals";
import { BaseAssetId, ContractFactory, sleep } from "fuels";

import { readFileSync, writeFileSync } from "fs";
import { FuelNetwork } from "../src/sdk/blockchain";
import { Api } from "../src/sdk/blockchain/fuel/Api";
import { OrderbookAbi__factory } from "../src/sdk/blockchain/fuel/types/orderbook";
import { PRIVATE_KEY } from "../src/config";
import fetchReceiptsFromEnvio from "../src/utils/fetchReceiptsFromEnvio";
import BN from "../src/utils/BN";
import { decodeOrderbookReceipts } from "../src/decoders/decodeOrderbookReceipts";

describe("Envio indexer data encode test", () => {
  let fuelNetwork: FuelNetwork;

  beforeEach(async () => {
    fuelNetwork = new FuelNetwork();
    await fuelNetwork.connectWalletByPrivateKey(PRIVATE_KEY);
  });

  it("should emit and decode data", async () => {
    const wallet = fuelNetwork.walletManager.wallet!;

    const sellSize = 4414;
    const sellPrice = 62329750000000;
    const buySize = 18812;
    const buyPrice = 63649539999990;

    console.log("Wallet address: ", wallet.address);
    console.log(
      "Eth balance   : ",
      await wallet.getBalance(BaseAssetId).then((b) => b.toString()),
      " ETH"
    );

    const byteCode = readFileSync(`./contract/out/debug/orderbook.bin`);
    const abi = JSON.parse(readFileSync(`./contract/out/debug/orderbook-abi.json`, "utf8"));

    const orderbookfactory = new ContractFactory(byteCode, abi, wallet);
    const { minGasPrice: gasPrice } = wallet.provider.getGasConfig();

    const btc = fuelNetwork.getTokenBySymbol("BTC");
    const usdc = fuelNetwork.getTokenBySymbol("USDC");

    const configurableConstants = {
      QUOTE_TOKEN: { value: usdc.assetId },
      QUOTE_TOKEN_DECIMALS: 6,
      PRICE_DECIMALS: 9,
    };
    const blockNumber = await fuelNetwork
      .getProviderWallet()
      .then((res) => res.provider.getBlockNumber())
      .then((res) => res.toNumber());
    const contract = await orderbookfactory.deployContract({ gasPrice, configurableConstants });
    const contractId = contract.id.toHexString();
    console.log({ contractId, blockNumber });

    writeFileSync("./tests/orderbookAddresses.json", JSON.stringify({ contractId, blockNumber }));

    const api = new Api();

    await api.createSpotMarket(btc, 8, wallet, contractId);
    console.log("Market created: ", btc.assetId);
    await fuelNetwork.mintToken(btc.assetId, sellSize);
    console.log(`${sellSize / 1e8} btc Token minted`);
    const { orderId: sellOrderId } = await api.createSpotOrder(
      btc,
      usdc,
      "-" + sellSize.toString(),
      sellPrice.toString(),
      wallet,
      contractId
    );
    console.log({ sellOrderId });

    const usdcAmount = Math.ceil(
      new BN(buySize).times(buySize).div(1e8).div(1e8).times(1e6).toNumber()
    );
    await fuelNetwork.mintToken(usdc.assetId, usdcAmount);
    console.log(`${usdcAmount / 1e6} USDC Token minted`);
    const { orderId: buyOrderId } = await api.createSpotOrder(
      btc,
      usdc,
      buySize.toString(),
      buyPrice.toString(),
      wallet,
      contractId
    );

    await sleep(1000);
    const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);

    const sellOrder = await orderbookAbi.functions
      .order_by_id(sellOrderId)
      .simulate()
      .then((res) => res.value);
    const buyOrder = await orderbookAbi.functions
      .order_by_id(buyOrderId)
      .simulate()
      .then((res) => res.value);
    console.log({ sellOrder: decodeOrder(sellOrder), buyOrder: decodeOrder(buyOrder) });
    await api
      .matchSpotOrders(sellOrderId, buyOrderId, wallet, contractId)
      .catch((e) => console.error(e.cause.logs));
    console.log("Orders matched");
    await sleep(1000);

    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, +blockNumber + 1000, [
      contractId,
    ]);
    const events = decodeOrderbookReceipts(receiptsResult?.receipts!, orderbookAbi);
    console.log(events);
  }, 60_000);
  it("match orders", async () => {
    const wallet = fuelNetwork.walletManager.wallet!;

    const api = new Api();
    const contractId = "0x72175cdd41bbf890f8cddfe54fa55ac0f311f963c010746337f1c2ac3d79ffbb";
    const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);
    const sellOrderId = "0x4d8e67903374b36c22fcf0fb07bd9a9060a9fbae37fd2c2a8f478335c9363ed8";
    const buyOrderId = "0x4285de56c7b84da6417f5bae151087b0dc8aa9b2746feed34d968d2d09fca62a";
    const sellOrder = await orderbookAbi.functions
      .order_by_id(sellOrderId)
      .simulate()
      .then((res) => res.value);
    const buyOrder = await orderbookAbi.functions
      .order_by_id(buyOrderId)
      .simulate()
      .then((res) => res.value);
    console.log({ sellOrder: decodeOrder(sellOrder), buyOrder: decodeOrder(buyOrder) });

    await api
      .matchSpotOrders(sellOrderId, buyOrderId, wallet, contractId)
      .then(() => console.log("Orders matched"))
      .catch((e) => console.error(e));
  }, 60_000);

  it("should create and cancel order", async () => {
    const wallet = fuelNetwork.walletManager.wallet!;

    console.log("Wallet address: ", wallet.address);
    console.log(
      "Eth balance   : ",
      await wallet.getBalance(BaseAssetId).then((b) => b.toString()),
      " ETH"
    );

    const { contractId, blockNumber } = JSON.parse(
      readFileSync("./tests/orderbookAddresses.json").toString()
    );
    console.log({ contractId, blockNumber });

    const btc = fuelNetwork.getTokenBySymbol("BTC");
    const usdc = fuelNetwork.getTokenBySymbol("USDC");

    const api = new Api();

    await fuelNetwork.mintToken(btc.assetId, 0.001 * 1e8);
    console.log(`0.001 btc Token minted`);
    const { orderId: sellOrderId } = await api.createSpotOrder(
      btc,
      usdc,
      "-100000",
      (69111 * 1e9).toString(),
      wallet,
      contractId
    );
    console.log({ sellOrderId });

    await api.cancelSpotOrder(sellOrderId, wallet, contractId);
  }, 60_000);

  it("should decode data", async () => {
    const wallet = fuelNetwork.walletManager.wallet!;
    const { contractId, blockNumber } = JSON.parse(
      readFileSync("./tests/orderbookAddresses.json").toString()
    );

    const receiptsResult = await fetchReceiptsFromEnvio(blockNumber, blockNumber + 5000, [
      contractId,
    ]);
    const orderbookAbi = OrderbookAbi__factory.connect(contractId, wallet);
    if (receiptsResult === null) return;
    console.log(decodeOrderbookReceipts(receiptsResult.receipts, orderbookAbi!));
  }, 60_000);
});

function decodeOrder(order: any) {
  return {
    id: order.id,
    trader: order.trader.value,
    base_token: order.base_token.value,
    base_size: (order.base_size.negative ? "-" : "") + order.base_size.value.toString(),
    base_price: order.base_price.toString(),
  };
}
