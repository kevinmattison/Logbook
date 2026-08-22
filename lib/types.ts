export interface Flight {
  id: number;
  flight_number: number | null;
  flight_date: string | null; // ISO yyyy-mm-dd, null for the aggregate training entry
  duration_minutes: number;
  max_elevation_m: number | null;
  distance_km: number | null;
  wing: string | null;
  flight_type: string | null;
  site: string | null;
  comments: string | null;
  is_aggregate: boolean;
  aggregate_label: string | null;
  created_at: string;
}

export interface NewFlightInput {
  flight_date: string; // yyyy-mm-dd
  duration_minutes: number;
  site?: string;
  wing?: string;
  comments?: string;
  max_elevation_m?: number;
  distance_km?: number;
  flight_type?: string;
}

export interface UpdateFlightInput {
  flight_date: string | null;
  duration_minutes: number;
  site: string | null;
  wing: string | null;
  comments: string | null;
  max_elevation_m: number | null;
  distance_km: number | null;
}

export interface PilotSettings {
  pilot_name: string | null;
  sahpa_number: string | null;
  email: string | null;
  phone: string | null;
  updated_at: string;
}

export interface NewPilotSettingsInput {
  pilot_name: string | null;
  sahpa_number: string | null;
  email: string | null;
  phone: string | null;
}

export interface IndemnityForm {
  id: number;
  passenger_name: string;
  email: string;
  phone: string;
  confirmed_adult: boolean;
  confirmed_risk: boolean;
  confirmed_insurance: boolean;
  confirmed_signature: boolean;
  signature_data_url: string;
  created_at: string;
}

export interface NewIndemnityInput {
  passenger_name: string;
  email: string;
  phone: string;
  confirmed_adult: boolean;
  confirmed_risk: boolean;
  confirmed_insurance: boolean;
  confirmed_signature: boolean;
  signature_data_url: string;
}

export interface Stats {
  total_hours: number;
  ytd_hours: number;
  total_flights: number;
  current_year: number;
  hours_by_wing: { wing: string; hours: number; flights: number }[];
  hours_by_year: { year: string; hours: number }[];
  longest_flight_minutes: number;
  highest_elevation_m: number | null;
  top_sites: { site: string; flights: number; hours: number }[];
  xc_flights: number;
}
