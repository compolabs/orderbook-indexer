import express from "express";
import PerpMarket from "../models/perpMarket";

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await PerpMarket.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events.' });
    }
});

export default router;
