import Sequelize from "sequelize";
import sequelize from "../db";

const PerpMarket = sequelize.define("perpMarkets", {
  asset_id: { type: Sequelize.STRING },
  decimal: { type: Sequelize.STRING },
  price_feed: { type: Sequelize.STRING },
  im_ratio: { type: Sequelize.STRING },
  mm_ratio: { type: Sequelize.STRING },
  status: { type: Sequelize.STRING },
  paused_index_price: { type: Sequelize.STRING, allowNull: true },
  paused_timestamp: { type: Sequelize.STRING, allowNull: true },
  closed_price: { type: Sequelize.STRING, allowNull: true },
});

export default PerpMarket;
