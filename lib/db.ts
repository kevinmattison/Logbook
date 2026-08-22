import { neon } from "@neondatabase/serverless";
import type {
  Flight,
  IndemnityForm,
  NewIndemnityInput,
  NewPilotSettingsInput,
  PilotSettings,
  UpdateFlightInput,
} from "./types";

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "No database connection string found. Set DATABASE_URL (or POSTGRES_URL) in your environment."
    );
  }
  return neon(connectionString, { fetchOptions: { cache: "no-store" } });
}

export async function ensureSchema() {
  const sql = getSql();
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
}

export async function getAllFlights(): Promise<Flight[]> {
  const sql = getSql();
  const rows = (await sql.query(`
    SELECT * FROM flights
    ORDER BY is_aggregate DESC, flight_date ASC NULLS FIRST, flight_number ASC NULLS FIRST, id ASC;
  `)) as unknown as Flight[];
  return rows;
}

export async function insertFlight(input: {
  flight_number: number | null;
  flight_date: string | null;
  duration_minutes: number;
  max_elevation_m: number | null;
  distance_km: number | null;
  wing: string | null;
  flight_type: string | null;
  site: string | null;
  comments: string | null;
}): Promise<Flight> {
  const sql = getSql();
  const rows = (await sql.query(
    `INSERT INTO flights (
      flight_number, flight_date, duration_minutes, max_elevation_m,
      distance_km, wing, flight_type, site, comments
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;`,
    [
      input.flight_number,
      input.flight_date,
      input.duration_minutes,
      input.max_elevation_m,
      input.distance_km,
      input.wing,
      input.flight_type,
      input.site,
      input.comments,
    ]
  )) as unknown as Flight[];
  return rows[0];
}

export async function getNextFlightNumber(): Promise<number> {
  const sql = getSql();
  const rows = (await sql.query(`SELECT MAX(flight_number) as max FROM flights;`)) as unknown as {
    max: number | null;
  }[];
  return (rows[0]?.max ?? 35) + 1;
}

export async function deleteFlight(id: number): Promise<void> {
  const sql = getSql();
  await sql.query(`DELETE FROM flights WHERE id = $1 AND is_aggregate = FALSE;`, [id]);
}

export async function updateFlight(id: number, input: UpdateFlightInput): Promise<Flight> {
  const sql = getSql();
  const rows = (await sql.query(
    `UPDATE flights SET
      flight_date = $2,
      duration_minutes = $3,
      site = $4,
      wing = $5,
      comments = $6,
      max_elevation_m = $7,
      distance_km = $8
    WHERE id = $1 AND is_aggregate = FALSE
    RETURNING *;`,
    [
      id,
      input.flight_date,
      input.duration_minutes,
      input.site,
      input.wing,
      input.comments,
      input.max_elevation_m,
      input.distance_km,
    ]
  )) as unknown as Flight[];
  if (!rows[0]) {
    throw new Error("Flight not found or cannot be edited.");
  }
  return rows[0];
}

export async function insertIndemnityForm(input: NewIndemnityInput): Promise<IndemnityForm> {
  const sql = getSql();
  const rows = (await sql.query(
    `INSERT INTO indemnity_forms (
      passenger_name, email, phone, confirmed_adult, confirmed_risk, confirmed_insurance, confirmed_signature, signature_data_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;`,
    [
      input.passenger_name,
      input.email,
      input.phone,
      input.confirmed_adult,
      input.confirmed_risk,
      input.confirmed_insurance,
      input.confirmed_signature,
      input.signature_data_url,
    ]
  )) as unknown as IndemnityForm[];
  return rows[0];
}

export async function getIndemnityForms(): Promise<IndemnityForm[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT * FROM indemnity_forms ORDER BY created_at DESC;`
  )) as unknown as IndemnityForm[];
  return rows;
}

export async function getSettings(): Promise<PilotSettings | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT pilot_name, sahpa_number, email, phone, updated_at FROM pilot_settings WHERE id = 1;`
  )) as unknown as PilotSettings[];
  return rows[0] || null;
}

export async function upsertSettings(input: NewPilotSettingsInput): Promise<PilotSettings> {
  const sql = getSql();
  const rows = (await sql.query(
    `INSERT INTO pilot_settings (id, pilot_name, sahpa_number, email, phone, updated_at)
     VALUES (1, $1, $2, $3, $4, now())
     ON CONFLICT (id) DO UPDATE SET
       pilot_name = EXCLUDED.pilot_name,
       sahpa_number = EXCLUDED.sahpa_number,
       email = EXCLUDED.email,
       phone = EXCLUDED.phone,
       updated_at = now()
     RETURNING pilot_name, sahpa_number, email, phone, updated_at;`,
    [input.pilot_name, input.sahpa_number, input.email, input.phone]
  )) as unknown as PilotSettings[];
  return rows[0];
}
