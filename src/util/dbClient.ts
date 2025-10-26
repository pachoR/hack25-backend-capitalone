import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = (
  text: string,
  params?: any[],
): Promise<QueryResult<any>> => {
  return pool.query(text, params);
};

export const getClient = async (): Promise<PoolClient> => {
  return pool.connect();
};

export const closePool = async (): Promise<void> => {
  await pool.end();
};
