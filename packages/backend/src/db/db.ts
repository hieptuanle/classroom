import type { Options } from "sequelize";

import config from "config";
import { Sequelize } from "sequelize";

import { getNodeEnv } from "@backend/libs/config.js";
import logger from "@backend/libs/logger.js";

// Database configuration
const dbConfig: Options = {
  host: config.get("database.host") || "localhost",
  port: config.get("database.port") || 5432,
  username: config.get("database.username") || "postgres",
  password: config.get("database.password") || "postgres",
  database: config.get("database.name") || "classroom",
  dialect: "postgres",
  logging: getNodeEnv() === "development" ? (sql: string) => logger.debug(sql) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const db = new Sequelize(dbConfig);

export async function connection() {
  try {
    await db.authenticate();
    logger.info("✅ Successfully connected to PostgreSQL database");

    // Sync models in development
    if (getNodeEnv() === "development") {
      await db.sync({ alter: true });
      logger.info("✅ Database models synchronized");
    }
  }
  catch (err) {
    logger.error("❌ Unable to connect to database: ", err);
    process.exit(1);
  }
}
