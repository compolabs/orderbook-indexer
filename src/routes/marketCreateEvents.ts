// src/routes/event.js

import express from 'express';
const router = express.Router();
import MarketCreateEvent from '../models/marketCreateEvent';

// Create a new event
// router.post('/', async (req, res) => {
//   try {
//     const event = await MarketCreateEvent.create(req.body);
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create event.' });
//   }
// });

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await MarketCreateEvent.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await MarketCreateEvent.findByPk(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found.' });
    } else {
      res.json(event);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event.' });
  }
});

// Update event by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const [updatedRowsCount] = await MarketCreateEvent.update(req.body, {
//         where: { id: req.params.id }
//     });
//     if (updatedRowsCount === 0) {
//       res.status(404).json({ message: 'Event not found.' });
//     } else {
//       const event = await MarketCreateEvent.findByPk(req.params.id);
//       res.json(event);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update event.' });
//   }
// });

// Delete event by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedRowsCount = await MarketCreateEvent.destroy({ where: { id: req.params.id } });
//     if (deletedRowsCount === 0) {
//       res.status(404).json({ message: 'Event not found.' });
//     } else {
//       res.json({ message: 'Event deleted successfully.' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete event.' });
//   }
// });

export default router;
