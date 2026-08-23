import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import {
  validateCreateUser,
  validateUpdateUser,
} from '../validators/user.validator.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create a new user
router.post('/', validateCreateUser, createUser);

// Update a user by ID
router.put('/:id', validateUpdateUser, updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

export default router;