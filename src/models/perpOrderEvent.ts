import Sequelize from 'sequelize';
import sequelize from '../db';

//todo
const PerpOrderEvent = sequelize.define('perpOrderEvents', {
    timestamp: {
        type: Sequelize.STRING,
    },
});

export default PerpOrderEvent;
