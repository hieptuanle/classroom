import config from "config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "./schema";

function createDb() {
  const client = new Client({
    host: config.get("database.host"),
    port: config.get("database.port"),
    user: config.get("database.username"),
    password: config.get("database.password"),
    database: config.get("database.name"),
  });
  return drizzle(client, {
    schema,
  });
}

const db = createDb();

export default db;
