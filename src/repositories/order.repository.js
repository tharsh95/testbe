import { getDatabase } from '../db/database.js';

const db = getDatabase();

export class OrderRepository {
  // Find an order by ID with its items
  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT o.*,
               json_group_array(
                   json_object(
                       'id', oi.id,
                       'productId', oi.product_id,
                       'quantity', oi.quantity,
                       'priceAtPurchase', oi.price_at_purchase
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        GROUP BY o.id`,
        [id],
        (err, row) => {
          if (err) return reject(err);
          // Parse the JSON string of items back into an array
          if (row && row.items) {
            try {
              row.items = JSON.parse(row.items);
            } catch (e) {
              row.items = [];
            }
          } else {
            row.items = [];
          }
          resolve(row);
        }
      );
    });
  }

  // Find all orders with their items
  async findAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT o.*,
               json_group_array(
                   json_object(
                       'id', oi.id,
                       'productId', oi.product_id,
                       'quantity', oi.quantity,
                       'priceAtPurchase', oi.price_at_purchase
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.id`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          // Parse the JSON string of items for each row
          rows.forEach(row => {
            if (row && row.items) {
              try {
                row.items = JSON.parse(row.items);
              } catch (e) {
                row.items = [];
              }
            } else {
              row.items = [];
            }
          });
          resolve(rows);
        }
      );
    });
  }

  // Create a new order with items in a transaction
async createOrder({ userId, items }) {
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', async (err) => {
      if (err) return reject(err);

      try {
        // Calculate total amount
        let totalAmount = 0;

        for (const item of items) {
          const product = await new Promise((res, rej) => {
            db.get(
              'SELECT price FROM products WHERE id = ?',
              [item.productId],
              (err, row) => {
                if (err) return rej(err);
                res(row);
              }
            );
          });

          if (!product) {
            throw new Error(
              `Product with id ${item.productId} not found`
            );
          }

          totalAmount += product.price * item.quantity;
        }

        // Insert the order
        const orderResult = await new Promise((res, rej) => {
          db.run(
            'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
            [userId, totalAmount],
            function (err) {
              if (err) return rej(err);
              res(this);
            }
          );
        });

        const orderId = orderResult.lastID;

        // Insert order items
        for (const item of items) {
          const product = await new Promise((res, rej) => {
            db.get(
              'SELECT price FROM products WHERE id = ?',
              [item.productId],
              (err, row) => {
                if (err) return rej(err);
                res(row);
              }
            );
          });

          await new Promise((res, rej) => {
            db.run(
              `INSERT INTO order_items
                (order_id, product_id, quantity, price_at_purchase)
               VALUES (?, ?, ?, ?)`,
              [
                orderId,
                item.productId,
                item.quantity,
                product.price
              ],
              function (err) {
                if (err) return rej(err);
                res(this);
              }
            );
          });
        }

        // Commit transaction
        db.run('COMMIT', (err) => {
          if (err) {
            return db.run('ROLLBACK', () => {
              reject(err);
            });
          }

          resolve({
            id: orderId,
            userId,
            totalAmount,
            items
          });
        });
      } catch (error) {
        db.run('ROLLBACK', () => {
          reject(error);
        });
      }
    });
  });
}
  // Update an order by ID (replace entire order) in a transaction
async update(id, { userId, items }) {
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', async (err) => {
      if (err) return reject(err);

      try {
        // Check if order exists
        const existingOrder = await new Promise((res, rej) => {
          db.get(
            'SELECT * FROM orders WHERE id = ?',
            [id],
            (err, row) => {
              if (err) return rej(err);
              res(row);
            }
          );
        });

        if (!existingOrder) {
          throw new Error(`Order with id ${id} not found`);
        }

        // Calculate total amount
        let totalAmount = 0;

        for (const item of items) {
          const product = await new Promise((res, rej) => {
            db.get(
              'SELECT price FROM products WHERE id = ?',
              [item.productId],
              (err, row) => {
                if (err) return rej(err);
                res(row);
              }
            );
          });

          if (!product) {
            throw new Error(
              `Product with id ${item.productId} not found`
            );
          }

          totalAmount += product.price * item.quantity;
        }

        // Update order
        await new Promise((res, rej) => {
          db.run(
            `UPDATE orders
             SET user_id = ?,
                 total_amount = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [userId, totalAmount, id],
            function (err) {
              if (err) return rej(err);
              res(this);
            }
          );
        });

        // Delete existing order items
        await new Promise((res, rej) => {
          db.run(
            'DELETE FROM order_items WHERE order_id = ?',
            [id],
            function (err) {
              if (err) return rej(err);
              res(this);
            }
          );
        });

        // Insert new order items
        for (const item of items) {
          const product = await new Promise((res, rej) => {
            db.get(
              'SELECT price FROM products WHERE id = ?',
              [item.productId],
              (err, row) => {
                if (err) return rej(err);
                res(row);
              }
            );
          });

          if (!product) {
            throw new Error(
              `Product with id ${item.productId} not found`
            );
          }

          await new Promise((res, rej) => {
            db.run(
              `INSERT INTO order_items
               (order_id, product_id, quantity, price_at_purchase)
               VALUES (?, ?, ?, ?)`,
              [
                id,
                item.productId,
                item.quantity,
                product.price
              ],
              function (err) {
                if (err) return rej(err);
                res(this);
              }
            );
          });
        }

        // Commit transaction
        db.run('COMMIT', (err) => {
          if (err) {
            return db.run('ROLLBACK', () => {
              reject(err);
            });
          }

          resolve({
            id,
            userId,
            totalAmount,
            items
          });
        });
      } catch (error) {
        db.run('ROLLBACK', () => {
          reject(error);
        });
      }
    });
  });
}

  // Delete an order by ID (and its items due to foreign key constraint)
  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM orders WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}