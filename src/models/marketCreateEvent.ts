// src/models/marketCreateEvent.js
import Sequelize from 'sequelize';
import sequelize from '../db';

const MarketCreateEvent = sequelize.define('marketCreateEvents', {
    asset_id: {
        type: Sequelize.STRING,
    },
    asset_decimals: {
        type: Sequelize.STRING,
    },
    timestamp: {
        type: Sequelize.STRING,
    },
});

export default MarketCreateEvent;
