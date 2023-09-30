import type { Config } from "drizzle-kit";
import "dotenv/config"; // Load environment variables

export default {
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DB_URL as string,
  },
} satisfies Config;
