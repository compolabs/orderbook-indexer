import Sequelize from 'sequelize';
import sequelize from '../db';

const SpotMarketCreateEvent = sequelize.define('spotMarketCreateEvents', {
    index: {type: Sequelize.STRING,},
    asset_id: {type: Sequelize.STRING,},
    asset_decimals: {type: Sequelize.STRING,},
    timestamp: { type: Sequelize.DATE },
});

export default SpotMarketCreateEvent;
