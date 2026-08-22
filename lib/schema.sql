-- Paragliding logbook schema
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

CREATE INDEX IF NOT EXISTS flights_date_idx ON flights (flight_date);
CREATE INDEX IF NOT EXISTS flights_wing_idx ON flights (wing);

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

CREATE TABLE IF NOT EXISTS pilot_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  pilot_name TEXT,
  sahpa_number TEXT,
  email TEXT,
  phone TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pilot_settings_single_row CHECK (id = 1)
);
