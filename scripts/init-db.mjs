// Creates the flights table. Safe to run multiple times.
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) in .env.local before running this script.");
  process.exit(1);
}
const sql = neon(connectionString);

async function main() {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS flights (
      id SERIAL PRIMARY KEY,
      flight_number INTEGER,
      flight_date DATE,
      duration_minutes INTEGER NOT NULL,
      max_elevation_m NUMERIC,
      distance_km NUMERIC,
      wing TEXT,
      flight_type TEXT,
      site TEXT,
      comments TEXT,
      is_aggregate BOOLEAN NOT NULL DEFAULT FALSE,
      aggregate_label TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await sql.query(`CREATE INDEX IF NOT EXISTS flights_date_idx ON flights (flight_date);`);
  await sql.query(`CREATE INDEX IF NOT EXISTS flights_wing_idx ON flights (wing);`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS indemnity_forms (
      id SERIAL PRIMARY KEY,
      passenger_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      confirmed_adult BOOLEAN NOT NULL DEFAULT FALSE,
      confirmed_risk BOOLEAN NOT NULL DEFAULT FALSE,
      confirmed_insurance BOOLEAN NOT NULL DEFAULT FALSE,
      confirmed_signature BOOLEAN NOT NULL DEFAULT FALSE,
      signature_data_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS pilot_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      pilot_name TEXT,
      sahpa_number TEXT,
      email TEXT,
      phone TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT pilot_settings_single_row CHECK (id = 1)
    );
  `);
  console.log("Schema created / verified.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
