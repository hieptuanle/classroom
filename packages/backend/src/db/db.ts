import { Options, Sequelize } from "sequelize";
import config from "config";

// Database configuration
const dbConfig: Options = {
  host: config.get("database.host") || "localhost",
  port: config.get("database.port") || 5432,
  username: config.get("database.username") || "postgres",
  password: config.get("database.password") || "postgres",
  database: config.get("database.name") || "classroom",
  dialect: "postgres",
  logging: config.get("database.logging") ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const db = new Sequelize(dbConfig);

export const connection = async () => {
  try {
    await db.authenticate();
    console.log("Success to connect to database");
    console.log("✅ Successfully connected to PostgreSQL database");

    // Sync models in development
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      await db.sync({ alter: true });
      console.log("✅ Database models synchronized");
    }
  } catch (err) {
    console.error("Unable to connect to database: ", err);
  }
};
