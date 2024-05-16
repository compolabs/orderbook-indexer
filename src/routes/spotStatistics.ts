import express from "express";
import Sequelize from "sequelize";
import spotTradeEvent from "../models/spotTradeEvent";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const { baseToken } = req.query;

    const conditions: any = [
      {
        timestamp: {
          [Sequelize.Op.gte]: Sequelize.literal("CURRENT_TIMESTAMP - INTERVAL '1 DAY'"),
        },
      },
    ];
    if (baseToken) conditions.push({ base_token: baseToken });

    const results = await spotTradeEvent.findAll({
      where: { [Sequelize.Op.and]: conditions },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.cast(Sequelize.col("trade_size"), "FLOAT")), "volume24h"],
        [Sequelize.fn("MAX", Sequelize.cast(Sequelize.col("trade_price"), "FLOAT")), "high24h"],
        [Sequelize.fn("MIN", Sequelize.cast(Sequelize.col("trade_price"), "FLOAT")), "low24h"],
      ],
      raw: true,
    });

    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

export default router;
