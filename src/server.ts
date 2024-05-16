import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

import express from "express";

import spotMarketCreateEvents from "./routes/spotMarketCreateEvents";
import spotOrders from "./routes/spotOrders";
import spotOrderChangeEvents from "./routes/spotOrderChangeEvents";
import spotTradeEvents from "./routes/spotTradeEvents";
import perpMarkets from "./routes/perpMarkets";
import perpPositions from "./routes/perpPositions";
import perpOrders from "./routes/perpOrders";
import perpTradeEvents from "./routes/perpTradeEvents";
import {
  ACCOUNT_BALANCE_ID,
  CLEARING_HOUSE_ID,
  END_BLOCK,
  ORDERBOOK_ID,
  PERP_MARKET_ID,
  PORT,
  PRIVATE_KEY,
  START_BLOCK,
} from "./config";

import SystemSettings from "./models/settings";
import fetchReceiptsFromEnvio from "./utils/fetchReceiptsFromEnvio";
import formatCountdown from "./utils/formatCountDown";
import { Provider, Wallet, WalletUnlocked, sleep } from "fuels";
import sequelize from "./db";
import { handleOrderbookReceipts } from "./handlers/handleOrderbookReceipts";
import { handleAccountBalanceReceipts } from "./handlers/handleAccountBalanceReceipts";
import { handleClearingHouseReceipts } from "./handlers/handleClearingHouseReceipts";
import { handlePerpMarketReceipts } from "./handlers/handlePerpMarketReceipts";
import spotStatistics from "./routes/spotStatistics";
import Spark, {
  BETA_NETWORK,
  BETA_CONTRACT_ADDRESSES,
  BETA_INDEXER_URL,
  AccountBalanceAbi,
  AccountBalanceAbi__factory,
  ClearingHouseAbi,
  ClearingHouseAbi__factory,
  OrderbookAbi,
  OrderbookAbi__factory,
  PerpMarketAbi,
  PerpMarketAbi__factory,
} from "@compolabs/spark-ts-sdk";

const app = express();

app.use(express.json());

app.use(function (_: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, API-Key"
  );
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/spot/statistics", spotStatistics);
app.use("/spot/marketCreateEvents", spotMarketCreateEvents);
app.use("/spot/orders", spotOrders);
app.use("/spot/orderChangeEvents", spotOrderChangeEvents);
app.use("/spot/tradeEvents", spotTradeEvents);

app.use("/perp/markets", perpMarkets);
app.use("/perp/positions", perpPositions);
app.use("/perp/tradeEvents", () => perpTradeEvents);
app.use("/perp/orders", perpOrders);
//todo
// app.use("/perp/marketEvents", () => perpMarketEvents);
// app.use("/perp/accountBalanceChangeEvents", () => perpAccountBalanceChangeEvents);
// app.use("/perp/orderEvents", () => perpOrderEvents);

type TIndexerSettings = { startBlock: number };

enum STATUS {
  ACTIVE,
  CHILL,
}

class Indexer {
  sdk: Spark;
  wallet: WalletUnlocked;
  public initialized = false;
  private orderbookAbi?: OrderbookAbi;
  private accountBalanceAbi?: AccountBalanceAbi;
  private clearingHouseAbi?: ClearingHouseAbi;
  private perpMarketAbi?: PerpMarketAbi;
  private readonly settings: TIndexerSettings;

  private status = STATUS.CHILL;
  private lastIterationDuration = 1000;
  private iterationCounter = 0;
  private contracts = [ORDERBOOK_ID, ACCOUNT_BALANCE_ID, CLEARING_HOUSE_ID, PERP_MARKET_ID].filter((v) => v != null && v != "") as any;

  constructor(settings: TIndexerSettings) {
    this.settings = settings;

    this.sdk = new Spark({
      networkUrl: BETA_NETWORK.url,
      contractAddresses: BETA_CONTRACT_ADDRESSES,
      indexerApiUrl: BETA_INDEXER_URL,
    });

    this.wallet = Wallet.fromPrivateKey(PRIVATE_KEY);

    new Promise(async (resolve) => {
      const provider = await Provider.create(BETA_NETWORK.url);
      this.wallet.provider = provider;
      this.sdk.setActiveWallet(this.wallet);
      resolve(true);
    })
      .then(() => {
        this.orderbookAbi = ORDERBOOK_ID ? OrderbookAbi__factory.connect(ORDERBOOK_ID, this.wallet) : undefined;
        this.clearingHouseAbi = CLEARING_HOUSE_ID ? ClearingHouseAbi__factory.connect(CLEARING_HOUSE_ID, this.wallet) : undefined;
        this.accountBalanceAbi = ACCOUNT_BALANCE_ID ? AccountBalanceAbi__factory.connect(ACCOUNT_BALANCE_ID, this.wallet) : undefined;
        this.perpMarketAbi = PERP_MARKET_ID ? PerpMarketAbi__factory.connect(PERP_MARKET_ID, this.wallet) : undefined;
      })
      .then(() => {
        console.log("🐅 Spark Indexer is ready to spark index!");
        this.initialized = true;
      });
  }

  run() {
    this.processNext(); // Запускаем первый процесс
  }

  private async processNext() {
    if (!this.initialized) {
      setTimeout(() => this.processNext(), 1000);
      return;
    }
    if (this.status === STATUS.ACTIVE) {
      // console.log("🍃 Last process is still active. Waiting for it to complete.");
      setTimeout(() => this.processNext(), 100); // Проверяем состояние каждую секунду
      return;
    }

    this.status = STATUS.ACTIVE;
    try {
      const startTime = Date.now();
      await this.do();
      this.lastIterationDuration = (Date.now() - startTime) / 1000;
    } catch (error) {
      console.error("An error occurred:", error);
      await sleep(50000);
    } finally {
      this.status = STATUS.CHILL;
      // console.log("✅ Process completed. Starting next one.");
      this.processNext();
    }
  }

  private async updateSettings(lastBlock: number) {
    const [settings, created] = await SystemSettings.findOrCreate({
      where: {},
      defaults: { lastBlock },
    });

    if (!created) await settings.set("lastBlock", lastBlock).save();
  }

  private async getSettings(): Promise<number> {
    const settings = await SystemSettings.findOne();
    return settings ? +(settings.get("lastBlock") as string) : 0;
  }

  do = async () => {
    this.iterationCounter = this.iterationCounter < 20 ? this.iterationCounter + 1 : 0;
    const STEP = 1000;

    const currentBlock = await this.getSettings();
    const fromBlock = currentBlock === 0 ? +START_BLOCK : currentBlock;
    if (END_BLOCK != null && fromBlock > +END_BLOCK) return;
    const toBlock = END_BLOCK == null ? fromBlock + STEP : +END_BLOCK;
    const receiptsResult = await fetchReceiptsFromEnvio(fromBlock, toBlock, this.contracts);

    if (!receiptsResult) {
      console.log("No receipt found");
      return;
    }

    // console.log({fromBlock, toBlock, archiveHeight: receiptsResult?.archiveHeight, nextBlock: receiptsResult?.nextBlock})
    const secLeft =
      ((receiptsResult.archiveHeight - receiptsResult.nextBlock) * this.lastIterationDuration) /
      STEP;
    const syncTime = formatCountdown(secLeft);
    this.iterationCounter === 0 &&
      console.log(
        `♻️ Processing: ${receiptsResult?.nextBlock} / ${receiptsResult?.archiveHeight} | ${secLeft > 1 ? `(~ ${syncTime} left)` : "synchronized"
        }`
      );

    if (receiptsResult == null || receiptsResult.receipts.length == 0) {
      await this.updateSettings(receiptsResult?.nextBlock ?? toBlock);
      return;
    }

    //MarketCreateEvent
    // OrderChangeEvent
    // TradeEvent
    await handleOrderbookReceipts(
      receiptsResult.receipts.filter(({ contract_id }: any) => contract_id == ORDERBOOK_ID),
      this.orderbookAbi!
    );
    //MarketEvent
    await handleClearingHouseReceipts(
      receiptsResult.receipts.filter(({ contract_id }: any) => contract_id == CLEARING_HOUSE_ID),
      this.clearingHouseAbi!
    );
    //AccountBalanceChangeEvent
    await handleAccountBalanceReceipts(
      receiptsResult.receipts.filter(({ contract_id }: any) => contract_id == ACCOUNT_BALANCE_ID),
      this.accountBalanceAbi!
    );
    //TradeEvent
    // OrderEvent
    await handlePerpMarketReceipts(
      receiptsResult.receipts.filter(({ contract_id }: any) => contract_id == PERP_MARKET_ID),
      this.perpMarketAbi!
    );

    await this.updateSettings(receiptsResult.nextBlock);
    await sleep(100);
  };
}

const indexerSettings = {
  startBlock: +START_BLOCK,
  privateKey: PRIVATE_KEY,
};
const indexer = new Indexer(indexerSettings);

sequelize.afterSync(() => indexer.run());

const port = PORT ?? 5000;

const print = `
 ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███████╗ █████╗ ██████╗ ██╗██╗     ██╗████████╗██╗   ██╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔══██╗██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║███████╗███████║██████╔╝██║██║     ██║   ██║    ╚████╔╝ 
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║╚════██║██╔══██║██╔══██╗██║██║     ██║   ██║     ╚██╔╝  
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝███████║██║  ██║██████╔╝██║███████╗██║   ██║      ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝   
                                                                                                     
██╗      █████╗ ██████╗ ███████╗                                                                     
██║     ██╔══██╗██╔══██╗██╔════╝                                                                     
██║     ███████║██████╔╝███████╗                                                                     
██║     ██╔══██║██╔══██╗╚════██║                                                                     
███████╗██║  ██║██████╔╝███████║                                                                     
╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝                                                                     
                                                                                                     
🚀 Server ready at: http://localhost:${port}
`;

const server = app.listen(port, () => console.log(print));

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });
}
