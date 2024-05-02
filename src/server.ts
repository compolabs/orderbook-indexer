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
import {PORT, PRIVATE_KEY, PROXY_ID, START_BLOCK} from "./config";
import {FuelNetwork} from "./sdk/blockchain";
import SystemSettings from "./models/settings";
import fetchReceiptsFromEnvio from "./utils/fetchReceiptsFromEnvio";
import formatCountdown from "./utils/formatCountDown";
import {sleep} from "fuels";
import sequelize from "./db";
import spotStatistics from "./routes/spotStatistics";
import {ProxyContractAbi, ProxyContractAbi__factory} from "./sdk/blockchain/fuel/types/proxy";
import {handleProxyReceipts} from "./handlers/handleProxyReceipts";

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


type TIndexerSettings = { startBlock: number; };

enum STATUS {
    ACTIVE,
    CHILL,
}

class Indexer {
    private fuelNetwork = new FuelNetwork();
    public initialized = false;
    private proxyAbi?: ProxyContractAbi;
    private readonly settings: TIndexerSettings;

    private status = STATUS.CHILL;
    private lastIterationDuration = 1000;
    private iterationCounter = 0;
    private contracts = [PROXY_ID]

    constructor(settings: TIndexerSettings) {
        this.settings = settings;
        this.fuelNetwork
            .connectWalletByPrivateKey(PRIVATE_KEY)
            .then(() => {
                const wallet = this.fuelNetwork.walletManager.wallet!
                this.proxyAbi = ProxyContractAbi__factory.connect(PROXY_ID, wallet)
            })
            .then(() => (this.initialized = true))
            .catch(e => console.error(e));
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

        await handleProxyReceipts(receiptsResult.receipts.filter(({contract_id}: any) => contract_id == PROXY_ID), this.proxyAbi!)

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
