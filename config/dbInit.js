import { Client } from "pg";
import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

// Database connection configuration
const config = {
  host: "localhost",
  user: process.env.user,
  password: process.env.password,
  database: "postgres", // Connect to default postgres database first
  port: 5432,
};

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
  config.database = DB_NAME;
  console.log(`Created database ${DB_NAME} successfully!`);
  await client.end();
}

async function createTables(config) {
  let client;
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

    client = new Client(config);
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_USERS_TABLE);
    await client.query(CREATE_ITEMS_TABLE);

    return { dbStatus: "online" };
  } catch (error) {
    console.error("Error creating database and tables:", error);
    return { dbStatus: "offline" };
  } finally {
    await client.end();
  }
}

console.log(createTables(config));
