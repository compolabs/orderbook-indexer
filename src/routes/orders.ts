// src/routes/event.js

import express from 'express';
import Order from '../models/order';
import Sequelize, {DECIMAL} from "sequelize";

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        // Извлекаем параметры фильтрации из запроса
        const {trader, baseToken, orderType, isOpened, limit} = req.query;

        const conditions = [];
        let sortOrder: any[] = [];

        if (trader) conditions.push({trader: trader});
        if (baseToken) conditions.push({base_token: baseToken});
        if (orderType === "buy") {
            conditions.push(Sequelize.literal(`CAST(base_size AS DECIMAL) > 0`));
            sortOrder = [Sequelize.literal(`CAST(base_price AS DECIMAL) DESC`)];
        }
        if (orderType === "sell") {
            conditions.push(Sequelize.literal(`CAST(base_size AS DECIMAL) < 0`));
            sortOrder = [Sequelize.literal(`CAST(base_price AS DECIMAL) ASC`)];
        }
        if (isOpened) conditions.push(Sequelize.literal(`CAST(base_size AS DECIMAL) != 0`));

        // Получаем ордера, применяя условия фильтрации
        const orders = await Order.findAll({
            where: {[Sequelize.Op.and]: conditions},
            order: sortOrder,
            limit: limit != null ? +limit : 40
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch orders.'});
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({message: 'Order not found.'});
        } else {
            res.json(order);
        }
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch order.'});
    }
});

// Update order by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const [updatedRowsCount] = await Order.update(req.body, {
//         where: { id: req.params.id }
//     });
//     if (updatedRowsCount === 0) {
//       res.status(404).json({ message: 'Order not found.' });
//     } else {
//       const order = await Order.findByPk(req.params.id);
//       res.json(order);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update order.' });
//   }
// });

// Delete order by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedRowsCount = await Order.destroy({ where: { id: req.params.id } });
//     if (deletedRowsCount === 0) {
//       res.status(404).json({ message: 'Order not found.' });
//     } else {
//       res.json({ message: 'Order deleted successfully.' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete order.' });
//   }
// });

export default router;
