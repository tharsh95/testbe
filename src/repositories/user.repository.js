import { getDatabase } from '../db/database.js';

const db = getDatabase();

export class UserRepository {
  // Find a user by ID
  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Find a user by email
  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Find all users
  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY id', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Create a new user
  async create({ name, email }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name, email });
        }
      );
    });
  }

  // Update a user by ID
  async update(id, { name, email }) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, email, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }

  // Delete a user by ID
  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}