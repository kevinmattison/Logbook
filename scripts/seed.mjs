// Seeds the database with:
//  1. An aggregate row for flights 1-35 (basic training, 8:14 total logged as a block)
//  2. The 379 individually logged flights (36-415) from the source logbook
//
// Safe-ish to re-run: it checks whether the flights table already has rows
// and skips seeding if so, so you don't get duplicates. Pass --force to wipe
// and reseed.
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FORCE = process.argv.includes("--force");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) in .env.local before running this script.");
  process.exit(1);
}
const sql = neon(connectionString);

async function main() {
  const countRows = await sql.query(`SELECT COUNT(*)::int as count FROM flights;`);
  const existing = countRows[0].count;

  if (existing > 0 && !FORCE) {
    console.log(
      `flights table already has ${existing} rows. Run with --force to wipe and reseed.`
    );
    return;
  }

  if (FORCE) {
    await sql.query(`DELETE FROM flights;`);
    console.log("Cleared existing flights.");
  }

  // 1. Basic training aggregate: flights 1-35, 8 hours 14 minutes total.
  await sql.query(
    `INSERT INTO flights (
      flight_number, flight_date, duration_minutes, wing, flight_type,
      site, comments, is_aggregate, aggregate_label
    ) VALUES ($1, NULL, $2, NULL, 'PG Solo', NULL, 'Basic training course', TRUE, $3);`,
    [35, 8 * 60 + 14, "Flights 1-35 (basic training, logged as a block)"]
  );
  console.log("Inserted training aggregate (flights 1-35, 8:14).");

  // 2. Individual logged flights
  const raw = readFileSync(join(__dirname, "flights_seed.json"), "utf-8");
  const flights = JSON.parse(raw);

  let count = 0;
  for (const f of flights) {
    await sql.query(
      `INSERT INTO flights (
        flight_number, flight_date, duration_minutes, max_elevation_m,
        distance_km, wing, flight_type, site, comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        f.flight_number,
        f.date,
        f.duration_minutes,
        f.max_elevation_m,
        f.distance_km,
        f.wing,
        f.flight_type,
        f.site,
        f.comments,
      ]
    );
    count++;
  }
  console.log(`Inserted ${count} logged flights (numbers 36-415).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
