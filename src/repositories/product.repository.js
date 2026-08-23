import { getDatabase } from '../db/database.js';

const db = getDatabase();

export class ProductRepository {
  // Find a product by ID
  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Find all products
  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products ORDER BY id', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Create a new product
  async create({ name, price }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price) VALUES (?, ?)',
        [name, price],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name, price });
        }
      );
    });
  }

  // Update a product by ID
  async update(id, { name, price }) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE products SET name = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, price, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }

  // Delete a product by ID
  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}