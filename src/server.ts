import cron from 'node-cron'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';

import express from 'express';

import marketCreateEventsRoutes from './routes/marketCreateEvents';
import ordersRoutes from './routes/orders';
import orderChangeEventsRoutes from './routes/orderChangeEvents';
import tradeEventsRoutes from './routes/tradeEvents';
import {CONTRACT_ID, PORT, PRIVATE_KEY, START_BLOCK} from "./config";
import {checkFieldsInObject, getEventFields} from "./sdk/testItils";
import {FuelNetwork} from "./sdk/blockchain";
import {OrderbookAbi, OrderbookAbi__factory} from "./sdk/blockchain/fuel/types/orderbook";
import axios from "axios";
import {getDecodedLogs, sleep, TransactionResultReceipt} from "fuels";
import {BN} from "@fuel-ts/math";
import {ReceiptLogData} from "@fuel-ts/transactions/dist/coders/receipt";
import {Nullable} from "tsdef";
import MarketCreateEvent from "./models/marketCreateEvent";
import OrderChangeEvent from "./models/orderChangeEvent";
import TradeEvent from "./models/tradeEvent";
import SystemSettings from "./models/settings";
import Order from "./models/order";
import OrderChangeEvents from "./routes/orderChangeEvents";

const app = express();

app.use(express.json());

app.use(function (_: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key')
    next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// PROTECT ALL ROUTES THAT FOLLOW
// app.use((req: Request, res: Response, next: NextFunction) => {
//     const apiKey = req.get('API-Key')
//     if (!apiKey || apiKey !== process.env.API_KEY) {
//         res.status(401).json({error: 'unauthorised'})
//     } else {
//         next()
//     }
// })
app.use('/marketCreateEvents', marketCreateEventsRoutes);
app.use('/orders', ordersRoutes);
app.use('/orderChangeEvents', orderChangeEventsRoutes);
app.use('/tradeEvents', tradeEventsRoutes);

type TIndexerSettings = { contractId: string, startBlock: number, privateKey: string }
type TGetReceiptsResult = {
    archiveHeight: number,
    nextBlock: number,
    receipts: Array<TransactionResultReceipt>
}
type TMarketCreateEvent = {
    asset_id: string,
    asset_decimals: number,
    timestamp: string
}
type TOrderChangeEvent = {
    order_id: string,
    trader: string,
    base_token: string,
    base_size_change: string,
    base_price: string,
    timestamp: string
}
type TTradeEvent = {
    base_token: string
    order_matcher: string
    seller: string
    buyer: string
    trade_size: string
    trade_price: string
    timestamp: string
}
type TDecodedEvent = TMarketCreateEvent
    | TOrderChangeEvent
    | TTradeEvent

class Indexer {
    private fuelNetwork = new FuelNetwork();
    public initialized = false
    private orderbookAbi?: OrderbookAbi
    private readonly settings: TIndexerSettings

    constructor(settings: TIndexerSettings) {
        this.settings = settings
        this.fuelNetwork.connectWalletByPrivateKey(settings.privateKey)
            .then(() => this.initialized = false)
            .then(() => this.orderbookAbi = OrderbookAbi__factory.connect(settings.contractId, this.fuelNetwork.walletManager.wallet!));
    }

    runCrone(cronExpression: string) {
        cron.schedule(cronExpression, this.do)
    }

    private async updateSettings(lastBlock: number) {
        const [settings, created] = await SystemSettings.findOrCreate({
            where: {},
            defaults: {lastBlock}
        });

        if (!created) await settings.set("lastBlock", lastBlock).save()
    }

    private async getSettings(): Promise<number> {
        const settings = await SystemSettings.findOne();
        return settings ? +(settings.get("lastBlock") as string) : 0;
    }


    do = async () => {
        if (this.orderbookAbi === null) return;
        const currentBlock = await this.getSettings()
        const fromBlock = currentBlock === 0 ? +START_BLOCK : currentBlock
        const toBlock = fromBlock + 1000
        const receiptsResult = await this.fetchReceipts(fromBlock, toBlock)
        if (receiptsResult === null) return;
        for (let i = 0; i < receiptsResult.receipts.length; i++) {
            const receipt = receiptsResult.receipts[i]
            const decodedEvents = this.decodeReceipt(receipt)
            for (let eventIndex in decodedEvents) {
                const event = decodedEvents[eventIndex]
                console.log(event)
                if (this.isEvent("MarketCreateEvent", event)) {
                    await MarketCreateEvent.create({...event});
                }
                if (this.isEvent("OrderChangeEvent", event)) {
                    await OrderChangeEvent.create(event);
                    const [order, created] = await Order.findOrCreate({
                        where: {order_id: (event as TOrderChangeEvent).order_id},
                        defaults: {...event, base_size: (event as TOrderChangeEvent).base_size_change}
                    });

                    if (!created) await order.set("base_size", (event as TOrderChangeEvent).base_size_change).save()

                    // const order = await Order.findOne({where: {order_id: (event as TOrderChangeEvent).order_id}})
                    // if (order === null){
                    //     await Order.create({
                    //         order_id: event.order_id,
                    //         trader: event.trader,
                    //         base_token: event.base_token,
                    //         base_size: event.base_size,
                    //         order_price: event.order_price,
                    //         timestamp: event.timestamp,
                    //     })
                    // }else {
                    //     await order.set("base_size", event.base_size).save()
                    // }

                    // order_id
                    // trader
                    // base_token
                    // base_size
                    // order_price
                    // timestamp
                }
                if (this.isEvent("TradeEvent", event)) {
                    await TradeEvent.create(event);
                }
            }
        }

        await this.updateSettings(receiptsResult.nextBlock)
    }


    private async fetchReceipts(fromBlock: number, toBlock: number): Promise<Nullable<TGetReceiptsResult>> {
        console.log({fromBlock, toBlock})
        if (this.orderbookAbi == null) return null;
        const request = {
            "from_block": fromBlock,
            "to_block": toBlock,
            "receipts": [
                {"contract_id": [this.settings.contractId], "receipt_type": [6]},
                {"root_contract_id": [this.settings.contractId], "receipt_type": [6]}
            ],
            "field_selection": {"receipt": ["receipt_type", "contract_id", "ra", "rb", "ptr", "len", "digest", "pc", "is", "data", "root_contract_id"]}
        }
        const indexerData = await axios.post("https://fuel-next.hypersync.xyz/query", request).then(response => response.data);
        const rawReceipts = (indexerData as any).data[0].receipts.filter(({receipt_type}: any) => receipt_type == 6);
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


    isEvent = (eventName: string, object: any) => checkFieldsInObject(object, getEventFields(eventName, this.orderbookAbi!)!)

    decodeReceipt(receipt: TransactionResultReceipt): TDecodedEvent[] {
        try {
            const logs = getDecodedLogs([receipt], this.orderbookAbi!.interface)
            const decodedLogs = logs.map((log: any) => {
                // MarketCreateEvent
                if (this.isEvent("MarketCreateEvent", log)) {
                    return {
                        asset_id: log.asset_id.value,
                        asset_decimals: log.asset_decimals,
                        timestamp: log.timestamp.toString()
                    } as TMarketCreateEvent
                }
                // OrderChangeEvent
                if (this.isEvent("OrderChangeEvent", log)) {
                    return {
                        order_id: log.order_id,
                        trader: log.trader.value,
                        base_token: log.base_token.value,
                        base_size_change: (log.base_size_change.negative ? "-" : "") + log.base_size_change.value.toString(),
                        base_price: log.base_price.toString(),
                        timestamp: log.timestamp.toString()
                    } as TOrderChangeEvent;
                }
                // TradeEvent
                if (this.isEvent("TradeEvent", log)) {
                    return {
                        base_token: log.base_token.value,
                        order_matcher: log.order_matcher.value,
                        seller: log.seller.value,
                        buyer: log.buyer.value,
                        trade_size: log.trade_size.toString(),
                        trade_price: log.trade_price.toString(),
                        timestamp: log.timestamp.toString(),
                    } as TTradeEvent;
                }
            })
            return decodedLogs.filter(e => e !== undefined) as TDecodedEvent[]
        } catch (e) {
            console.error(e)
            return []
        }
    }

}


const indexerSettings = {contractId: CONTRACT_ID, startBlock: +START_BLOCK, privateKey: PRIVATE_KEY}
const indexer = new Indexer(indexerSettings)
// indexer.runCrone('*/2 * * * *')
sleep(5000).then(indexer.do)


const port = PORT ?? 5000

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
                                                                                                     
${"🚀 Server ready at: http://localhost:" + port}       `;

app.listen(port, () => console.log(print));
