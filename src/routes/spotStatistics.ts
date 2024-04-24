import express from "express";
import Sequelize from "sequelize";
import spotTradeEvent from "../models/spotTradeEvent";

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const results = await spotTradeEvent.findAll({
            where: {timestamp: {[Sequelize.Op.gte]: Sequelize.literal("CURRENT_TIMESTAMP - INTERVAL '1 DAY'")}},
            attributes: [
                [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('trade_size'), 'FLOAT')), 'volume24h'],
                [Sequelize.fn('MAX', Sequelize.cast(Sequelize.col('trade_price'), 'FLOAT')), 'high24h'],
                [Sequelize.fn('MIN', Sequelize.cast(Sequelize.col('trade_price'), 'FLOAT')), 'low24h']
            ],
            raw: true
        });

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch orders.'});
    }
});

export default router;
