import Sequelize from 'sequelize';
import sequelize from '../db';

//todo
const PerpMarketEvent = sequelize.define('perpMarketEvents', {
    timestamp: { type: Sequelize.DATE },
});


export default PerpMarketEvent;
