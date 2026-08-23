import { z } from 'zod';

// Schema for creating a product
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be a positive number'),
});

// Schema for updating a product (partial)
export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
});

// Middleware for validating product creation
export const validateCreateProduct = (req, res, next) => {
  const result = createProductSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.format(),
      },
    });
  }
  next();
};

// Middleware for validating product update
export const validateUpdateProduct = (req, res, next) => {
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.format(),
      },
    });
  }
  next();
};