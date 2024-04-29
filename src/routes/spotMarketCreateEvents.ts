
import express from "express";
import SpotMarketCreateEvent from "../models/spotMarketCreateEvent";

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await SpotMarketCreateEvent.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await SpotMarketCreateEvent.findByPk(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found.' });
    } else {
      res.json(event);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event.' });
  }
});

export default router;
