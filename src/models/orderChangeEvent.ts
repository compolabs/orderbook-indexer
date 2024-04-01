// src/models/orderChangeEvent.js
import Sequelize from 'sequelize';
import sequelize from '../db';

const OrderChangeEvent = sequelize.define('orderChangeEvents', {
    order_id: {
        type: Sequelize.STRING,
    },
    trader: {
        type: Sequelize.STRING,
    },
    base_token: {
        type: Sequelize.STRING,
    },
    base_size_change: {
        type: Sequelize.STRING,
    },
    base_price: {
        type: Sequelize.STRING,
    },
    timestamp: {
        type: Sequelize.STRING,
    },
    // blockNumber: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    // },
    // transactionHash: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    // }
});

export default OrderChangeEvent;
