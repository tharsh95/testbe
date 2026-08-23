import { z } from 'zod';

// Schema for creating a user
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

// Schema for updating a user (partial)
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
});

// Middleware for validating user creation
export const validateCreateUser = (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);
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

// Middleware for validating user update
export const validateUpdateUser = (req, res, next) => {
  const result = updateUserSchema.safeParse(req.body);
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