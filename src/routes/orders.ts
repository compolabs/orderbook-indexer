// src/routes/event.js

import express from 'express';
import Order from '../models/order';
const router = express.Router();

// Create a new order
// router.post('/', async (req, res) => {
//   try {
//     const order = await Order.create(req.body);
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create order.' });
//   }
// });

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
    } else {
      res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order.' });
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
