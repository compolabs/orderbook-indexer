// src/routes/event.js

import express from 'express';
import TradeEvent from '../models/tradeEvent';
import Sequelize from "sequelize";
import Order from "../models/order";

const router = express.Router();

// Create a new event
// router.post('/', async (req, res) => {
//   try {
//     const event = await TradeEvent.create(req.body);
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create event.' });
//   }
// });

// Get all events
// router.get('/', async (req, res) => {
//   try {
//     const events = await TradeEvent.findAll();
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch events.' });
//   }
// });

router.get('/', async (req, res) => {
    try {
        const { trader, baseToken, limit } = req.query;

        const conditions: any = {
            [Sequelize.Op.or]: [
                { buyer: trader },
                { seller: trader }
            ]
        };

        if (baseToken) conditions.base_token = baseToken;

        const orders = await TradeEvent.findAll({
            where: conditions,
            limit: limit != null ? +limit : 80
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch orders.'});
    }
});

// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await TradeEvent.findByPk(req.params.id);
        if (!event) {
            res.status(404).json({message: 'Event not found.'});
        } else {
            res.json(event);
        }
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch event.'});
    }
});

// Update event by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const [updatedRowsCount] = await TradeEvent.update(req.body, {
//         where: { id: req.params.id }
//     });
//     if (updatedRowsCount === 0) {
//       res.status(404).json({ message: 'Event not found.' });
//     } else {
//       const event = await TradeEvent.findByPk(req.params.id);
//       res.json(event);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update event.' });
//   }
// });

// Delete event by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedRowsCount = await TradeEvent.destroy({ where: { id: req.params.id } });
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
