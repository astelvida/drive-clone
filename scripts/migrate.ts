import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "../src/db";
import * as dotenv from "dotenv";

dotenv.config();

// This script runs the migrations
async function main() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

main();
