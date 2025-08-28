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
  const CREATE_RECIPES_TABLE = `
    CREATE TABLE IF NOT EXISTS RECIPES (
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL
)`;
  try {
    // Execute the database creation and seeding
    await createDatabase(config);
    client = new Client(config);

    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_RECIPES_TABLE);

    return { dbStatus: "online" };
  } catch (error) {
    console.error("Error creating database and tables:", error);
    return { dbStatus: "offline" };
  } finally {
    await client.end();
  }
}

console.log(createTables(config));
