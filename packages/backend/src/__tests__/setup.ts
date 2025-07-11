import { getNodeEnv } from "@backend/libs/config";
import logger from "@backend/libs/logger";

import { db } from "../db/db";
import Assignment from "../models/assignment";
import Class from "../models/class";
import Post from "../models/post";
import User from "../models/user";

beforeAll(async () => {
  // Ensure we're using test environment
  if (getNodeEnv() !== "test") {
    throw new Error("Tests must be run with NODE_ENV=test");
  }

  try {
    // Connect to test database
    await db.authenticate();
    logger.info("Connected to test database");

    // Drop and recreate database to ensure clean state
    await db.drop();
    await db.sync({ force: true });
  }
  catch (error) {
    // If there's any database issue, log and try to continue
    logger.error("Database setup warning:", error);
    await db.sync({ force: true });
  }
});

beforeEach(async () => {
  // Clean up data before each test but keep schema
  try {
    await Assignment.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    await Class.destroy({ where: {}, truncate: true });
    await Post.destroy({ where: {}, truncate: true });
  }
  catch (error) {
    // Tables might not exist yet, that's okay
    logger.error("Tables not yet created, skipping cleanup %s", error);
  }
});

afterAll(async () => {
  // Clean up database and close connection
  try {
    await db.close();
    logger.error("Closed test database connection");
  }
  catch (error) {
    console.error("Error during cleanup:", error);
  }
});
