import Sequelize from "sequelize";
import sequelize from "../db";

const SpotOrder = sequelize.define("spotOrders", {
  order_id: { type: Sequelize.STRING },
  trader: { type: Sequelize.STRING },
  base_token: { type: Sequelize.STRING },
  base_size: { type: Sequelize.STRING },
  base_price: { type: Sequelize.STRING },
  timestamp: { type: Sequelize.DATE },
});

export default SpotOrder;
