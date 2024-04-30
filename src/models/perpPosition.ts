import Sequelize from "sequelize";
import sequelize from "../db";
const PerpPosition = sequelize.define("perpPositions", {
  trader: { type: Sequelize.STRING },
  base_token: { type: Sequelize.STRING },
  taker_position_size: { type: Sequelize.STRING },
  taker_open_notional: { type: Sequelize.STRING },
  last_tw_premium_growth_global: { type: Sequelize.STRING },
});

export default PerpPosition;
