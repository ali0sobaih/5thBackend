import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing! Please check your .env file.");
}

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "smartsyriahorizon",
  password: "crossroads",
  waitForConnections: true,
});

export const db = drizzle(pool);
export const connectionPool = pool;
