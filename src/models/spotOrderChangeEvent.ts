import Sequelize from 'sequelize';
import sequelize from '../db';

const SpotOrderChangeEvent = sequelize.define('spotorderChangeEvents', {
    index: {type: Sequelize.STRING,},
    order_id: {type: Sequelize.STRING,},
    new_base_size: {type: Sequelize.STRING,},
    timestamp: { type: Sequelize.DATE },
});

export default SpotOrderChangeEvent;
