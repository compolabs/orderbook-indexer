import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

import express from "express";

import marketCreateEventsRoutes from "./routes/marketCreateEvents";
import ordersRoutes from "./routes/orders";
import orderChangeEventsRoutes from "./routes/orderChangeEvents";
import tradeEventsRoutes from "./routes/tradeEvents";
import {ACCOUNT_BALANCE_ID, CLEARING_HOUSE_ID, ORDERBOOK_ID, PORT, PRIVATE_KEY, START_BLOCK} from "./config";
import {FuelNetwork} from "./sdk/blockchain";
import {OrderbookAbi, OrderbookAbi__factory} from "./sdk/blockchain/fuel/types/orderbook";
import SystemSettings from "./models/settings";
import fetchReceiptsFromEnvio from "./utils/fetchReceiptsFromEnvio";
import isEvent from "./utils/isEvent";
import formatCountdown from "./utils/formatCountDown";
import {sleep, Wallet} from "fuels";
import sequelize from "./db";
import {AccountBalanceAbi, AccountBalanceAbi__factory} from "./sdk/blockchain/fuel/types/account-balance";
import {ClearingHouseAbi, ClearingHouseAbi__factory} from "./sdk/blockchain/fuel/types/clearing-house";
import {handleOrderbookReceipts} from "./handlers/handleOrderbookReceipts";
import {handleAccountBalanceReceipts} from "./handlers/handleAccountBalanceReceipts";
import {handleClearingHouseReceipts} from "./handlers/handleClearingHouseReceipts";
import {ReceiptLogData} from "@fuel-ts/transactions";

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

type TIndexerSettings = { startBlock: number; };

enum STATUS {
    ACTIVE,
    CHILL,
}

class Indexer {
    private fuelNetwork = new FuelNetwork();
    public initialized = false;
    private orderbookAbi?: OrderbookAbi;
    private accountBalanceAbi?: AccountBalanceAbi;
    private clearingHouseAbi?: ClearingHouseAbi;
    private readonly settings: TIndexerSettings;

    private status = STATUS.CHILL;
    private lastIterationDuration = 1000;
    private iterationCounter = 0;
    private contracts = [ORDERBOOK_ID, ACCOUNT_BALANCE_ID, CLEARING_HOUSE_ID]

    constructor(settings: TIndexerSettings) {
        this.settings = settings;
        this.fuelNetwork
            .connectWalletByPrivateKey(PRIVATE_KEY)
            .then(() => {
                const wallet = this.fuelNetwork.walletManager.wallet!
                this.orderbookAbi = OrderbookAbi__factory.connect(ORDERBOOK_ID, wallet)
                this.clearingHouseAbi = ClearingHouseAbi__factory.connect(CLEARING_HOUSE_ID, wallet)
                this.accountBalanceAbi = AccountBalanceAbi__factory.connect(ACCOUNT_BALANCE_ID, wallet)
            })
            .then(() => (this.initialized = true))
            .then(() => "ok").catch(e => {
            console.log(e)
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
            await sleep(50000)
        } finally {
            this.status = STATUS.CHILL;
            // console.log("✅ Process completed. Starting next one.");
            this.processNext();
        }
    }

    private async updateSettings(lastBlock: number) {
        const [settings, created] = await SystemSettings.findOrCreate({
            where: {},
            defaults: {lastBlock},
        });

        if (!created) await settings.set("lastBlock", lastBlock).save();
    }

    private async getSettings(): Promise<number> {
        const settings = await SystemSettings.findOne();
        return settings ? +(settings.get("lastBlock") as string) : 0;
    }

    do = async () => {
        this.iterationCounter = this.iterationCounter < 20 ? this.iterationCounter + 1 : 0
        const STEP = 1000;

        const currentBlock = await this.getSettings();
        const fromBlock = currentBlock === 0 ? +START_BLOCK : currentBlock;
        const toBlock = fromBlock + STEP;
        const receiptsResult = await fetchReceiptsFromEnvio(
            fromBlock,
            toBlock,
            this.contracts
        );

        // console.log({fromBlock, toBlock, archiveHeight: receiptsResult?.archiveHeight, nextBlock: receiptsResult?.nextBlock})
        const secLeft = ((receiptsResult?.archiveHeight! - receiptsResult?.nextBlock!) * this.lastIterationDuration) / STEP;
        const syncTime = formatCountdown(secLeft);
        this.iterationCounter === 0 &&
        console.log(`♻️ Processing: ${receiptsResult?.nextBlock} / ${receiptsResult?.archiveHeight} | ${secLeft > 1 ? `(~ ${syncTime} left)` : "synchronized"}`);

        if (receiptsResult == null || receiptsResult.receipts.length == 0) {
            await this.updateSettings(receiptsResult?.nextBlock ?? toBlock);
            return;
        }

        for (let i = 0; i < receiptsResult.receipts.length; i++) {
            const receipt: any = receiptsResult.receipts[i];
            receipt.contract_id === ORDERBOOK_ID &&
                await handleOrderbookReceipts([receipt], this.orderbookAbi!)

            // receipt.contract_id === ACCOUNT_BALANCE_ID &&
            //     await handleAccountBalanceReceipts([receipt], this.accountBalanceAbi!)
            //
            // receipt.contract_id === CLEARING_HOUSE_ID &&
            //     await handleClearingHouseReceipts([receipt], this.clearingHouseAbi!)

        }

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

/*
{
{
  order_id: '0xe52d4e7b06e5528f4e93f21602ff546ea4c7876a29e96cc51ad479e84cb8511e',
  trader: '0x8e3bcc4316900e48929b4826cca9af280292f72f8665351ecfaa9ffdadb7b637',
  base_token: '0x593b117a05f5ea64b39ba1f9bc3fb7e7a791c9be130e28376ad552eacdb3b746',
  base_size_change: '45855',
  base_price: '60771748762320',
  timestamp: '4611686020140759195'
}

  order_id: '0xe52d4e7b06e5528f4e93f21602ff546ea4c7876a29e96cc51ad479e84cb8511e',
  trader: '0x8e3bcc4316900e48929b4826cca9af280292f72f8665351ecfaa9ffdadb7b637',
  base_token: '0x593b117a05f5ea64b39ba1f9bc3fb7e7a791c9be130e28376ad552eacdb3b746',
  base_size_change: '-46181',
  base_price: '60771748762320',
  timestamp: '4611686020140759993'
}
{
  base_token: '0x593b117a05f5ea64b39ba1f9bc3fb7e7a791c9be130e28376ad552eacdb3b746',
  order_matcher: '0x194c4d5d321ea3bc2e87109f4a86520ad60f924998f67007d487d3cc0acc45d2',
  seller: '0xf107d61bcedecf2c6087c33810a0ea10574b9dbee33f37da5c7d3aa70f818cbb',
  buyer: '0x8e3bcc4316900e48929b4826cca9af280292f72f8665351ecfaa9ffdadb7b637',
  trade_size: '46181',
  trade_price: '60342633306130',
  sell_order_id: '0xae43cf87490b9c4ae8329e1b50a990a4652f35c0cf66c80c5d6ec1ee661164ea',
  buy_order_id: '0xe52d4e7b06e5528f4e93f21602ff546ea4c7876a29e96cc51ad479e84cb8511e',
  timestamp: '4611686020140759993'
}


* */
