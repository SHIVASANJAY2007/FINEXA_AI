import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL environment variable is not defined.");
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
    ? { rejectUnauthorized: false }
    : false
});

// Register global pool error handler to prevent unhandled 'error' event crashes
pool.on('error', (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message || err);
});

export const initDb = async () => {
  try {
    // Verify connection
    const client = await pool.connect();
    console.log("Successfully connected to the PostgreSQL database.");
    client.release();

    // Create tables in correct dependency order
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personal_details (
        person_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS travel_details (
        travel_id SERIAL PRIMARY KEY,
        person_id VARCHAR(20) REFERENCES personal_details(person_id) ON DELETE CASCADE,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        date_of_going DATE,
        date_of_returning DATE,
        activities TEXT,
        mode_of_transport VARCHAR(100),
        hotel_required BOOLEAN DEFAULT FALSE,
        hotel_name VARCHAR(255),
        car_rent BOOLEAN DEFAULT FALSE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        chat_id BIGSERIAL PRIMARY KEY,
        person_id VARCHAR(20) REFERENCES personal_details(person_id) ON DELETE CASCADE,
        session_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables initialized successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};
