import express from "express";
import PerpOrderEvent from "../models/PerpOrderEvent";

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await PerpOrderEvent.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events.' });
    }
});

