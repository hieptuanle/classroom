// import { getNodeEnv } from "@backend/libs/config";
// import logger from "@backend/libs/logger";
export {};
// import { db } from "../../db/db";
// import Class from "../models/class";
// import Post from "../models/post";
// import User from "../models/user";
// beforeAll(async () => {
//   // Ensure we're using test environment
//   if (getNodeEnv() !== "test") {
//     throw new Error("Tests must be run with NODE_ENV=test");
//   }
//   // Connect to test database
//   await db.authenticate();
//   logger.info("Connected to test database");
//   // Sync models with force option to recreate tables
//   await db.sync({ force: true });
// });
// beforeEach(async () => {
//   // Clean up data before each test but keep schema
//   try {
//     await User.destroy({ where: {}, truncate: true });
//     await Class.destroy({ where: {}, truncate: true });
//     await Post.destroy({ where: {}, truncate: true });
//   }
//   catch (error) {
//     // Tables might not exist yet, that's okay
//     logger.error("Tables not yet created, skipping cleanup %s", error);
//   }
// });
// afterAll(async () => {
//   // Clean up database and close connection
//   try {
//     await db.close();
//     logger.error("Closed test database connection");
//   }
//   catch (error) {
//     console.error("Error during cleanup:", error);
//   }
// });
