import { UserService } from '../services/user.service.js';

const userService = new UserService();

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Email already in use') {
      res.status(409).json({ error: { message: error.message } });
    } else {
      res.status(400).json({ error: { message: error.message } });
    }
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: { message: error.message } });
    } else if (error.message === 'Email already in use') {
      res.status(409).json({ error: { message: error.message } });
    } else {
      res.status(400).json({ error: { message: error.message } });
    }
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};