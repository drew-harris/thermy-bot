import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  uri: process.env.DB_URL,
});

export const db = drizzle(connection);
