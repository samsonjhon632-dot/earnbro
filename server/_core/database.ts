import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../drizzle/schema";
import { ENV } from "./env";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    // Get database connection string from environment
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.warn("[DB] DATABASE_URL not configured, database features will be unavailable");
      return null;
    }

    // Parse connection string
    const url = new URL(dbUrl);
    const pool = mysql.createPool({
      host: url.hostname,
      port: parseInt(url.port || "3306"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    dbInstance = drizzle(pool as any, { schema, mode: "default" });
    console.log("[DB] Connected to database");
    return dbInstance;
  } catch (error) {
    console.error("[DB] Failed to connect to database:", error);
    return null;
  }
}

export async function closeDb() {
  if (dbInstance) {
    // Connection will be closed when the pool is destroyed
    dbInstance = null;
  }
}
