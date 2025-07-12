#!/usr/bin/env node

/**
 * Database Drop Script
 *
 * This script drops the entire database and recreates it.
 * Uses the config package to get database connection settings.
 * Defaults to development environment if NODE_ENV is not set.
 *
 * Usage:
 *   npx tsx src/scripts/drop-database.ts
 *   npx tsx src/scripts/drop-database.ts --force  (skip confirmation)
 *   NODE_ENV=development npx tsx src/scripts/drop-database.ts
 *   NODE_ENV=test npx tsx src/scripts/drop-database.ts
 */

import config from "config";
import { createInterface } from "node:readline";
import { Client } from "pg";

import { getNodeEnv, setDefaultEnv } from "@backend/libs/config";
import logger from "@backend/libs/logger";

async function dropDatabase() {
  // Set default environment to development if not specified
  setDefaultEnv();

  const environment = getNodeEnv();

  logger.info("Starting database drop operation", { environment });

  // Get database configuration from config package
  const dbConfig = {
    host: config.get<string>("database.host"),
    port: config.get<number>("database.port"),
    user: config.get<string>("database.username"),
    password: config.get<string>("database.password"),
    database: config.get<string>("database.name"),
  };

  logger.info("Database configuration", {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
  });

  // Check for force flag
  const isForced = process.argv.includes("--force") || process.argv.includes("--no-confirm");

  // Confirm with user before proceeding (except in test environment or when forced)
  if (environment !== "test" && !isForced) {
    console.warn(`\n⚠️  WARNING: This will completely drop the database "${dbConfig.database}" on ${dbConfig.host}:${dbConfig.port}\n`);

    console.warn("This action cannot be undone!\n");

    // Simple confirmation prompt
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question("Are you sure you want to continue? (yes/no): ", resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== "yes") {
      logger.info("Database drop operation cancelled by user");

      console.warn("Operation cancelled.");
      process.exit(0);
    }
  }

  let adminClient: Client | null = null;

  try {
    // Connect to PostgreSQL as admin (to postgres database)
    adminClient = new Client({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: "postgres", // Connect to postgres database to manage other databases
    });

    await adminClient.connect();
    logger.info("Connected to PostgreSQL server");

    // Terminate all active connections to the target database
    logger.info(`Terminating active connections to database "${dbConfig.database}"`);
    await adminClient.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid != pg_backend_pid()
    `, [dbConfig.database]);

    // Check if database exists
    const dbExistsResult = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database],
    );

    if (dbExistsResult.rows.length > 0) {
      // Drop the database
      logger.info(`Dropping database "${dbConfig.database}"`);
      await adminClient.query(`DROP DATABASE IF EXISTS "${dbConfig.database}"`);
      logger.info(`Database "${dbConfig.database}" dropped successfully`);
    }
    else {
      logger.info(`Database "${dbConfig.database}" does not exist, nothing to drop`);
    }

    // Recreate the database
    logger.info(`Creating database "${dbConfig.database}"`);
    await adminClient.query(`CREATE DATABASE "${dbConfig.database}"`);
    logger.info(`Database "${dbConfig.database}" created successfully`);

    console.error(`\n✅ Database "${dbConfig.database}" has been dropped and recreated successfully!`);

    console.error("\nNext steps:");

    console.error("1. Run database migrations to set up the schema");

    console.error("2. Seed the database with initial data if needed");
  }
  catch (error) {
    logger.error("Failed to drop database", { error: error instanceof Error ? error.message : error });
    console.error("\n❌ Database drop operation failed!");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
  finally {
    // Close admin connection
    if (adminClient) {
      await adminClient.end();
      logger.info("Disconnected from PostgreSQL server");
    }
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  dropDatabase()
    .then(() => {
      logger.info("Database drop script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Database drop script failed", { error: error instanceof Error ? error.message : error });
      process.exit(1);
    });
}

export default dropDatabase;
