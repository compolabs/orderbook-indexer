import Sequelize from 'sequelize';
import sequelize from '../db';

const SpotMarketCreateEvent = sequelize.define('spotMarketCreateEvents', {
    asset_id: {type: Sequelize.STRING,},
    asset_decimals: {type: Sequelize.STRING,},
    timestamp: {type: Sequelize.STRING,},
});

export default SpotMarketCreateEvent;
