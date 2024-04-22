// src/routes/event.js

import express from 'express';
import TradeEvent from '../models/spotTradeEvent';
import Sequelize from "sequelize";

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const {trader, baseToken, limit} = req.query;

        const conditions: any = {};

        if (trader != null) conditions[Sequelize.Op.or] = [{buyer: trader}, {seller: trader}]

        if (baseToken) conditions.base_token = baseToken;

        const orders = await TradeEvent.findAll({
            where: conditions,
            limit: limit != null ? +limit : 80
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch event.'});
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


export default router;
