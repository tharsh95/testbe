import { getDatabase } from './database.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const runMigrations = async () => {
  const db = getDatabase();
  const migrationPath = resolve('./src/db/migrations/001_initial.sql');

  try {
    const sql = readFileSync(migrationPath, 'utf8');
    // Execute the migration script
    db.exec(sql, (err) => {
      if (err) {
        console.error('Error running migrations:', err);
        process.exit(1);
      }
      console.log('Migrations executed successfully');
      // Close the database connection after migration
      db.close((closeErr) => {
        if (closeErr) {
          console.error('Error closing database connection:', closeErr);
        }
        process.exit(0);
      });
    });
  } catch (fileErr) {
    console.error('Error reading migration file:', fileErr);
    process.exit(1);
  }
};

runMigrations();