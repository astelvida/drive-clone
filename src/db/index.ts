import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "./schema";

// For better DX, we can enable logging in development
const queryLogging = process.env.NODE_ENV === "development";

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL!);

// Create database instance
export const db = drizzle(sql, {
  schema,
  logger: queryLogging,
});

// Utility function to run migrations
export async function runMigrations() {
  if (process.env.NODE_ENV === "production") {
    try {
      await migrate(db, { migrationsFolder: "drizzle" });
      console.log("Migrations completed");
    } catch (error) {
      console.error("Error running migrations:", error);
      throw error;
    }
  }
}
