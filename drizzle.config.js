"use strict";
require("dotenv/config"); // Load environment variables
exports.default = {
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
};
