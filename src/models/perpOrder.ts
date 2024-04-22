import Sequelize from 'sequelize';
import sequelize from '../db';

const PerpOrder = sequelize.define('perpOrders', {
    order_id: {type: Sequelize.STRING,},
    trader: {type: Sequelize.STRING,},
    base_token: {type: Sequelize.STRING,},
    base_size: {type: Sequelize.STRING,},
    base_price: {type: Sequelize.STRING,},
    timestamp: {type: Sequelize.STRING,}
});

export default PerpOrder;
