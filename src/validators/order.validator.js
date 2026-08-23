import { z } from 'zod';

// Schema for creating an order
export const createOrderSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  items: z.array(
    z.object({
      productId: z.number().int().positive('Product ID must be a positive integer'),
      quantity: z.number().int().positive('Quantity must be a positive integer'),
    })
  ).min(1, 'At least one item is required'),
});

// Schema for updating an order (same as create for simplicity, but we can make partial if needed)
export const updateOrderSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer').optional(),
  items: z.array(
    z.object({
      productId: z.number().int().positive('Product ID must be a positive integer'),
      quantity: z.number().int().positive('Quantity must be a positive integer'),
    })
  ).min(1, 'At least one item is required').optional(),
});

// Middleware for validating order creation
export const validateCreateOrder = (req, res, next) => {
  const result = createOrderSchema.safeParse(req.body);
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

// Middleware for validating order update
export const validateUpdateOrder = (req, res, next) => {
  const result = updateOrderSchema.safeParse(req.body);
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