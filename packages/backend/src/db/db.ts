import { Sequelize } from "sequelize";
import config from "config";

// Option 1: Passing a connection URI
export const db = new Sequelize(
  config.get("database.url")
); // Example for postgres

export const connection = async () => {
  try {
    await db.authenticate();
    console.log("Success to connect to database");
  } catch (err) {
    console.error("Unable to connect to database: ", err);
  }
};
