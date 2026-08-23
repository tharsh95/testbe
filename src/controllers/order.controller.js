import { OrderService } from '../services/order.service.js';

const orderService = new OrderService();

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    if (error.message.startsWith('Product with id') || error.message === 'Quantity must be positive') {
      res.status(400).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ error: { message: error.message } });
    } else if (error.message.startsWith('Product with id') || error.message === 'Quantity must be positive') {
      res.status(400).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};