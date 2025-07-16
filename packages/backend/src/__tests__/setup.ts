import db, { client, connectPromise } from "@backend/db";
import { assignments, classEnrollments, classes, submissions, users } from "@backend/db/schema";
import { getNodeEnv } from "@backend/libs/config";
import logger from "@backend/libs/logger";

beforeAll(async () => {
  // Ensure we're using test environment
  if (getNodeEnv() !== "test") {
    throw new Error("Tests must be run with NODE_ENV=test");
  }

  await connectPromise;
});

beforeEach(async () => {
  // Clean up data before each test but keep schema
  try {
    await db.delete(submissions);
    await db.delete(classEnrollments);
    await db.delete(assignments);
    await db.delete(classes);
    await db.delete(users);
  }
  catch (error) {
    // Tables might not exist yet, that's okay
    logger.error("Error during cleanup: %s", error);
  }
});

afterAll(async () => {
  // Clean up database and close connection
  try {
    await client.end();
    logger.info("Test suite completed");
  }
  catch (error) {
    console.error("Error during cleanup:", error);
  }
});
