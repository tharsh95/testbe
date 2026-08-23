import { OrderRepository } from '../repositories/order.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();

export class OrderService {
  // Get all orders
  async getAllOrders() {
    return await orderRepository.findAll();
  }

  // Get order by ID
  async getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  // Create a new order
  async createOrder({ userId, items }) {
    // Validate that user exists? We could check, but for simplicity we rely on foreign key constraint.
    // Validate that each product exists and has enough stock? We don't have stock tracking, so just check existence.
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      // Additional validation: quantity must be positive (already in validator, but double-check)
      if (item.quantity <= 0) {
        throw new Error(`Quantity must be positive for product ${item.productId}`);
      }
    }
    return await orderRepository.createOrder({ userId, items });
  }

  // Update order by ID
  async updateOrder(id, { userId, items }) {
    // Validate that user exists? Similarly, we rely on foreign key.
    // Validate products
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Quantity must be positive for product ${item.productId}`);
      }
    }
    return await orderRepository.update(id, { userId, items });
  }

  // Delete order by ID
  async deleteOrder(id) {
    const deleted = await orderRepository.delete(id);
    if (!deleted) {
      throw new Error('Order not found');
    }
  }
}