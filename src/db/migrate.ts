import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from ".";
dotenv.config();

// create the connection

// this will automatically run needed migrations on the database

const runMigration = async () => {
  try {
    console.log("Migrating");
    await migrate(db, { migrationsFolder: "./drizzle" });
  } catch (error) {
    console.error(error);
  }
};

runMigration();
