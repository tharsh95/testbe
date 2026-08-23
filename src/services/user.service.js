import { UserRepository } from '../repositories/user.repository.js';

const userRepository = new UserRepository();

export class UserService {
  // Get all users
  async getAllUsers() {
    return await userRepository.findAll();
  }

  // Get user by ID
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Create a new user
  async createUser({ name, email }) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    return await userRepository.create({ name, email });
  }

  // Update user by ID
  async updateUser(id, { name, email }) {
    // Check if email is already used by another user
    if (email) {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use');
      }
    }
    const updated = await userRepository.update(id, { name, email });
    if (!updated) {
      throw new Error('User not found');
    }
    return await userRepository.findById(id);
  }

  // Delete user by ID
  async deleteUser(id) {
    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
  }
}