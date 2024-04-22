import Sequelize from 'sequelize';
import sequelize from '../db';

const PerpTradeEvent = sequelize.define('perpTradeEvents', {

    base_token: {type: Sequelize.STRING},
    seller: {type: Sequelize.STRING},
    buyer: {type: Sequelize.STRING},
    trade_size: {type: Sequelize.STRING},
    trade_price: {type: Sequelize.STRING},
    sell_order_id: {type: Sequelize.STRING},
    buy_order_id: {type: Sequelize.STRING},
    timestamp: {type: Sequelize.STRING},
});

export default PerpTradeEvent;
