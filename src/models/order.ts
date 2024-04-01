// src/models/order.js
import Sequelize from 'sequelize';
import sequelize from '../db';

const Order = sequelize.define('orders', {
    order_id: {
        type: Sequelize.STRING,
    },
    trader: {
        type: Sequelize.STRING,
    },
    base_token: {
        type: Sequelize.STRING,
    },
    base_size: {
        type: Sequelize.STRING,
    },
    base_price: {
        type: Sequelize.STRING,
    },
    timestamp: {
        type: Sequelize.STRING,
    }
});

export default Order;
