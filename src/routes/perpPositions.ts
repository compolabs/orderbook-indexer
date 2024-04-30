import express from "express";
import PerpPosition from "../models/perpPosition";
import Sequelize from "sequelize";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Извлекаем параметры фильтрации из запроса
    const { trader, baseToken, limit } = req.query;

    const conditions = [];
    const sortOrder: any[] = [];

    if (trader) conditions.push({ trader: trader });
    if (baseToken) conditions.push({ base_token: baseToken });

    // Получаем ордера, применяя условия фильтрации
    const orders = await PerpPosition.findAll({
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
