import cron from "node-cron";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

import express, { Application } from "express";

import marketCreateEventsRoutes from "./routes/marketCreateEvents";
import ordersRoutes from "./routes/orders";
import orderChangeEventsRoutes from "./routes/orderChangeEvents";
import tradeEventsRoutes from "./routes/tradeEvents";
import { CONTRACT_ID, PORT, PRIVATE_KEY, START_BLOCK } from "./config";
import { FuelNetwork } from "./sdk/blockchain";
import { OrderbookAbi, OrderbookAbi__factory } from "./sdk/blockchain/fuel/types/orderbook";
import TradeEvent from "./models/tradeEvent";
import SystemSettings from "./models/settings";
import fetchReceiptsFromEnvio from "./utils/fetchReceiptsFromEnvio";
import isEvent from "./utils/isEvent";
import { decodeReceipts } from "./utils/decodeReceipts";
import MarketCreateEvent from "./models/marketCreateEvent";
import OrderChangeEvent from "./models/orderChangeEvent";
import Order from "./models/order";
import BN from "./utils/BN";
import { log } from "util";

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

// PROTECT ALL ROUTES THAT FOLLOW
// app.use((req: Request, res: Response, next: NextFunction) => {
//     const apiKey = req.get('API-Key')
//     if (!apiKey || apiKey !== process.env.API_KEY) {
//         res.status(401).json({error: 'unauthorised'})
//     } else {
//         next()
//     }
// })
app.use("/marketCreateEvents", marketCreateEventsRoutes);
app.use("/orders", ordersRoutes);
app.use("/orderChangeEvents", orderChangeEventsRoutes);
app.use("/tradeEvents", tradeEventsRoutes);

type TIndexerSettings = { contractId: string; startBlock: number; privateKey: string };

enum STATUS {
  ACTIVE,
  CHILL,
}

class Indexer {
  private fuelNetwork = new FuelNetwork();
  public initialized = false;
  private orderbookAbi?: OrderbookAbi;
  private readonly settings: TIndexerSettings;

  private status = STATUS.CHILL;

  constructor(settings: TIndexerSettings) {
    this.settings = settings;
    this.fuelNetwork
      .connectWalletByPrivateKey(settings.privateKey)
      .then(() => (this.initialized = false))
      .then(
        () =>
          (this.orderbookAbi = OrderbookAbi__factory.connect(
            settings.contractId,
            this.fuelNetwork.walletManager.wallet!
          ))
      );
  }

  runCrone(cronExpression: string) {
    cron.schedule(cronExpression, async () => {
      if (this.status === STATUS.ACTIVE) {
        console.log("🍃 Last process is still active, skipping");
        return;
      }
      this.status = STATUS.ACTIVE;
      await this.do()
        .catch(console.error)
        .finally(() => (this.status = STATUS.CHILL));
    });
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
    const STEP = 1000;

    if (this.orderbookAbi === null) return;
    const currentBlock = await this.getSettings();
    const fromBlock = currentBlock === 0 ? +START_BLOCK : currentBlock;
    const toBlock = fromBlock + STEP;
    const receiptsResult = await fetchReceiptsFromEnvio(
      fromBlock,
      toBlock,
      this.settings.contractId
    );

    // console.log({fromBlock, toBlock, archiveHeight: receiptsResult?.archiveHeight, nextBlock: receiptsResult?.nextBlock})
    console.log(
      `♻️ Processing: ${receiptsResult?.nextBlock} / ${receiptsResult?.archiveHeight} (~${
        ((receiptsResult?.archiveHeight! - receiptsResult?.nextBlock!) * 5) / 60 / STEP
      } min)`
    );
    if (receiptsResult == null || receiptsResult.receipts.length == 0) {
      await this.updateSettings(receiptsResult?.nextBlock ?? toBlock);
      return;
    }

    const decodedEvents = decodeReceipts(receiptsResult.receipts, this.orderbookAbi!);
    for (let eventIndex = 0; eventIndex < decodedEvents.length; eventIndex++) {
      const event = decodedEvents[eventIndex];

      console.log(event);
      if (this.isEvent("MarketCreateEvent", event)) {
        await MarketCreateEvent.create({ ...event });
      } else if (this.isEvent("OrderChangeEvent", event)) {
        await OrderChangeEvent.create(event);
        const defaults: any = { ...event, base_size: (event as any).base_size_change };
        delete defaults.base_size_change;
        const [order, created] = await Order.findOrCreate({
          where: { order_id: (event as any).order_id },
          defaults,
        });

        if (!created) {
          const baseSizeChange = new BN((event as any).base_size_change);
          const baseSize = new BN(order.get("base_size") as string);
          await order.set("base_size", baseSize.plus(baseSizeChange).toString()).save();
        }
      } else if (this.isEvent("TradeEvent", event)) {
        await TradeEvent.create(event);
      } else {
        console.log("Unknown event", event);
      }
    }
    await this.updateSettings(receiptsResult.nextBlock);
  };

  isEvent = (eventName: string, object: any) => isEvent(eventName, object, this.orderbookAbi!);
}

const indexerSettings = {
  contractId: CONTRACT_ID,
  startBlock: +START_BLOCK,
  privateKey: PRIVATE_KEY,
};
const indexer = new Indexer(indexerSettings);
indexer.runCrone("*/5 * * * * *");

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
