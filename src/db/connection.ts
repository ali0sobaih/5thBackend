import { initEnv } from "@core/index";
initEnv();

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  waitForConnections: true,
});

export const db = drizzle(pool);
export const connectionPool = pool;
