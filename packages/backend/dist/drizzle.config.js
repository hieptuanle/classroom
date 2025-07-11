import config from "config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: config.get("database.host") || "localhost",
        port: config.get("database.port") || 5432,
        user: config.get("database.username") || "postgres",
        password: config.get("database.password") || "postgres",
        database: config.get("database.name") || "classroom",
    },
    verbose: true,
    strict: true,
});
