import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const poolConfig = {
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const initPool = (): Pool => {
  if (connectionString) {
    console.log("Initializing PostgreSQL pool with DATABASE_URL");
    return new Pool({
      ...poolConfig,
      connectionString,
    });
  }

  // Fallback to individual env vars
  console.log(
    "Initializing PostgreSQL pool with individual connection variables",
  );
  return new Pool({
    ...poolConfig,
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "food_order",
  });
};

// Prevent multiple pool instances in development (hot-reload safe)
let pool: Pool;

try {
  if (!global.__pgPool) {
    global.__pgPool = initPool();
  }
  pool = global.__pgPool;
} catch (error) {
  console.error("Failed to initialize PostgreSQL pool:", error);
  pool = initPool();
}

// Log connection errors
pool.on("error", (err: Error) => {
  console.error("PostgreSQL pool error:", err);
});

pool.on("connect", () => {
  console.log("PostgreSQL connection established");
});

export default pool;
