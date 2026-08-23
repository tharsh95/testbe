import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from '../validators/product.validator.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Create a new product
router.post('/', validateCreateProduct, createProduct);

// Update a product by ID
router.put('/:id', validateUpdateProduct, updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

export default router;