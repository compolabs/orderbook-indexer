// src/models/tradeEvent.js
import Sequelize from 'sequelize';
import sequelize from '../db';

const TradeEvent = sequelize.define('tradeEvents', {
    base_token: {
        type: Sequelize.STRING,
    },
    order_matcher: {
        type: Sequelize.STRING,
    },
    seller: {
        type: Sequelize.STRING,
    },
    buyer: {
        type: Sequelize.STRING,
    },
    trade_size: {
        type: Sequelize.STRING,
    },
    trade_price: {
        type: Sequelize.STRING,
    },
    sell_order_id: {
        type: Sequelize.STRING,
    },
    buy_order_id: {
        type: Sequelize.STRING,
    },
    timestamp: {
        type: Sequelize.STRING,
    },
    // blockNumber: {
    //     type: Sequelize.STRING,
    // },
    // blockTimestamp: {
    //     type: Sequelize.STRING,
    // },
    // transactionHash: {
    //     type: Sequelize.STRING,
    // }
});
export default TradeEvent;
