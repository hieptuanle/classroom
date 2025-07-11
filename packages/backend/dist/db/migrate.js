// import { migrate } from "drizzle-orm/postgres-js/migrator";
// import { client } from "./db.js";
// import logger from "../src/libs/logger.js";
export {};
// async function runMigrations() {
//   try {
//     logger.info("🔄 Running database migrations...");
//     await migrate(client, { migrationsFolder: "./src/db/migrations" });
//     logger.info("✅ Database migrations completed successfully");
//   } catch (error) {
//     logger.error("❌ Migration failed:", error);
//     process.exit(1);
//   } finally {
//     await client.end();
//   }
// }
// // Run migrations if this file is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   runMigrations();
// }
// export { runMigrations };
