import Sequelize from "sequelize";
import sequelize from "../db";

//todo
const PerpOrderEvent = sequelize.define("perpOrderEvents", {
  timestamp: { type: Sequelize.DATE },
});

export default PerpOrderEvent;
