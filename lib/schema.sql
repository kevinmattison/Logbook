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
