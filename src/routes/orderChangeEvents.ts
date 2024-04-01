// src/routes/event.js

import express from 'express';
import OrderChangeEvent from '../models/orderChangeEvent';
const router = express.Router();

// Create a new orderChangeEvent
// router.post('/', async (req, res) => {
//   try {
//     const event = await OrderChangeEvent.create(req.body);
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create event.' });
//   }
// });

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await OrderChangeEvent.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await OrderChangeEvent.findByPk(req.params.id);
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
//     const [updatedRowsCount] = await OrderChangeEvent.update(req.body, {
//         where: { id: req.params.id }
//     });
//     if (updatedRowsCount === 0) {
//       res.status(404).json({ message: 'Event not found.' });
//     } else {
//       const event = await OrderChangeEvent.findByPk(req.params.id);
//       res.json(event);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update event.' });
//   }
// });

// Delete event by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedRowsCount = await OrderChangeEvent.destroy({ where: { id: req.params.id } });
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
