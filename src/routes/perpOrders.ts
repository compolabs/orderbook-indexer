import express from "express";
import Sequelize from "sequelize";
import PerpOrderModel from "../models/perpOrder";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    // Извлекаем параметры фильтрации из запроса
    const { trader, baseToken, orderType, isOpened, limit } = req.query;

    const conditions = [];
    let sortOrder: any[] = [];

    if (trader) conditions.push({ trader: trader });
    if (baseToken) conditions.push({ base_token: baseToken });
    if (orderType === "buy") {
      conditions.push(Sequelize.literal(`CAST(base_size AS DECIMAL) > 0`));
      sortOrder = [Sequelize.literal(`CAST(base_price AS DECIMAL) DESC`)];
    }
    if (orderType === "sell") {
      conditions.push(Sequelize.literal(`CAST(base_size AS DECIMAL) < 0`));
      sortOrder = [Sequelize.literal(`CAST(base_price AS DECIMAL) ASC`)];
    }
    if (isOpened) conditions.push(Sequelize.literal(`CAST(base_size AS DECIMAL) != 0`));

    // Получаем ордера, применяя условия фильтрации
    const orders = await PerpOrderModel.findAll({
      where: { [Sequelize.Op.and]: conditions },
      order: sortOrder,
      limit: limit != null ? +limit : 40,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

export default router;
