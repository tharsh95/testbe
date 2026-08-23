import { ProductRepository } from '../repositories/product.repository.js';

const productRepository = new ProductRepository();

export class ProductService {
  // Get all products
  async getAllProducts() {
    return await productRepository.findAll();
  }

  // Get product by ID
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  // Create a new product
  async createProduct({ name, price }) {
    // Price validation is done in the validator, but we can double-check
    if (price <= 0) {
      throw new Error('Price must be positive');
    }
    return await productRepository.create({ name, price });
  }

  // Update product by ID
  async updateProduct(id, { name, price }) {
    // Price validation
    if (price <= 0) {
      throw new Error('Price must be positive');
    }
    const updated = await productRepository.update(id, { name, price });
    if (!updated) {
      throw new Error('Product not found');
    }
    return await productRepository.findById(id);
  }

  // Delete product by ID
  async deleteProduct(id) {
    const deleted = await productRepository.delete(id);
    if (!deleted) {
      throw new Error('Product not found');
    }
  }
}