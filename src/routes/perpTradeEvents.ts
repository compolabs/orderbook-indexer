import express from "express";
import TradeEvent from "../models/perpTradeEvent";
import Sequelize from "sequelize";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const { trader, baseToken, limit } = req.query;

    const conditions: any = {};

    if (trader != null) conditions[Sequelize.Op.or] = [{ buyer: trader }, { seller: trader }];

    if (baseToken) conditions.base_token = baseToken;

    const orders = await TradeEvent.findAll({
      where: conditions,
      limit: limit != null ? +limit : 80,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event." });
  }
});

export default router;
