import "dotenv/config";
// import db from './db/db';
import routes from "@backend-routes/index";
import bodyParser from "body-parser";
import config from "config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import morgan from "morgan";

// import { runMigrations } from "db/migrate.js";
import { setDefaultEnv } from "@backend/libs/config";
import logger, { stream } from "@backend/libs/logger.js";
// import { connection } from "db/db";

setDefaultEnv();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev", { stream }));
app.use("/api/v1/", routes);

const port = config.get("server.port") || 4000;
app.listen(port);
logger.info(`🚀 Node + Express REST API skeleton server started on port: ${port}`);

export const db = drizzle(process.env.DATABASE_URL! || "localhost");

// Initialize database connection and run migrations in development
// connection().then(() => {
// if (process.env.NODE_ENV === "development") {
//   runMigrations().catch((err) => {
//     logger.warn("⚠️ Migration failed, continuing without migrations:", err);
//   });
// }
// });

export default app;
