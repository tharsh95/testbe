import sqlite3 from 'sqlite3';
import { config } from '../config/env.js';

let dbInstance = null;

export const getDatabase = () => {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(config.DATABASE_PATH, (err) => {
      if (err) {
        console.error('Error opening SQLite database:', err.message);
        throw err;
      }
      console.log('Connected to SQLite database at', config.DATABASE_PATH);
    });
  }
  return dbInstance;
};