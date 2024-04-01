// src/models/tradeEvent.js
import Sequelize from 'sequelize';
import sequelize from '../db';

const TradeEvent = sequelize.define('tradeEvents', {
    base_token: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    order_matcher: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    seller: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    buyer: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    trade_size: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    trade_price: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    timestamp: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    // blockNumber: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    // },
    // blockTimestamp: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    // },
    // transactionHash: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    // }
});
export default TradeEvent;
