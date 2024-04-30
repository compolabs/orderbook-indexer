import express from "express";
import PerpMarketEvent from "../models/perpMarketEvent";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await PerpMarketEvent.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events." });
  }
});
