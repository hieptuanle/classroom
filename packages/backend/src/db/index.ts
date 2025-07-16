import config from "config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import logger from "@backend/libs/logger";

import * as schema from "./schema";

export const client = new Client({
  host: config.get("database.host"),
  port: config.get("database.port"),
  user: config.get("database.username"),
  password: config.get("database.password"),
  database: config.get("database.name"),
});

export const connectPromise = client.connect()
  .then(() => {
    logger.info(`✅ Database connected successfully ${config.get("database.host")}:${config.get("database.port")}`);
  })
  .catch((err) => {
    logger.error(`❌ Database connection error: ${err}`);
  });

const db = drizzle(client, {
  schema,
});

export default db;
