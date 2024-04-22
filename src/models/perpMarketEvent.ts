import Sequelize from 'sequelize';
import sequelize from '../db';

//todo
const PerpMarketEvent = sequelize.define('perpMarketEvents', {
    timestamp: {
        type: Sequelize.STRING,
    },
});


export default PerpMarketEvent;
