import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.message === 'Price must be positive') {
      res.status(400).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: { message: error.message } });
    } else if (error.message === 'Price must be positive') {
      res.status(400).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};