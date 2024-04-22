import express from "express";
import PerpAccountBalanceChangeEvent from "../models/perpAccountBalanceChangeEvent";

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await PerpAccountBalanceChangeEvent.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events.' });
    }
});

