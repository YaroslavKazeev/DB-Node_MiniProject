import { Client } from "pg";
import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

async function createDatabase(config) {
  const DB_NAME = "Second hand market app DB";
  const client = new Client(config);
  try {
    await client.connect();
    console.log("Connected to PostgreSQL server!");
    // Check if database exists and create it if it does not
    await client.query(`CREATE DATABASE "${DB_NAME}"`);
    console.log(`Created database ${DB_NAME} successfully!`);
  } catch (error) {
    if (error.code !== "42P04") {
      // 42P04 is the error code for "duplicate_database"
      throw error;
    }
  }
  // Changing the config to connect to the newly created DB
  config.database = DB_NAME;
  console.log(`Created database ${DB_NAME} successfully!`);
  await client.end();
}

async function createTables() {
  // Database connection configuration
  const config = {
    host: "localhost",
    user: process.env.user,
    password: process.env.password,
    database: "postgres", // Connect to default postgres database first
    port: 5432,
  };
  const CREATE_USERS_TABLE = `
    CREATE TABLE IF NOT EXISTS USERS (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(30) UNIQUE NOT NULL,
    hashedPassword VARCHAR(60) NOT NULL
)`;
  const CREATE_ITEMS_TABLE = `
    CREATE TABLE IF NOT EXISTS ITEMS (
    user_id VARCHAR(36),
    item_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) UNIQUE NOT NULL,
    price NUMERIC(7,2) NOT NULL,
    CONSTRAINT FK_USER_ID FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE
)`;
  try {
    await createDatabase(config);
    const client = new Client(config);
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    await client.query(CREATE_USERS_TABLE);
    await client.query(CREATE_ITEMS_TABLE);
    await client.end();
    return true;
  } catch (error) {
    console.error(
      "Error creating PostgreSQL database and tables, the app will continue to work in non-persistent-save mode:",
      error
    );
    return false;
  }
}

export default createTables;
