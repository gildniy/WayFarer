import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const query = (text, params) => {
  return new Promise((resolve, reject) => {
    pool.query(text, params, (error, results) =>
      error ? reject(error) : resolve(results.rows)
    );
  });
};


