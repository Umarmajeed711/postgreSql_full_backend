import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config'

export const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized:false // Disable cert verification (fine for neon/dev)
  }

});

