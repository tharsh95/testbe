import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/order.controller.js';
import {
  validateCreateOrder,
  validateUpdateOrder,
} from '../validators/order.validator.js';

const router = express.Router();

// Get all orders
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create a new order
router.post('/', validateCreateOrder, createOrder);

// Update an order by ID
router.put('/:id', validateUpdateOrder, updateOrder);

// Delete an order by ID
router.delete('/:id', deleteOrder);

export default router;