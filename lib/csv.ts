import type { Flight } from "./types";

export function flightsToCSV(flights: Flight[]): string {
  const headers = [
    "flight_number",
    "date",
    "duration_hms",
    "duration_minutes",
    "site",
    "wing",
    "flight_type",
    "max_elevation_m",
    "distance_km",
    "comments",
  ];

  const escape = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = flights.map((f) => {
    const h = Math.floor(f.duration_minutes / 60);
    const m = f.duration_minutes % 60;
    return [
      f.is_aggregate ? "1-35" : f.flight_number,
      f.flight_date || "",
      `${h}:${String(m).padStart(2, "0")}`,
      f.duration_minutes,
      f.site || "",
      f.wing || "",
      f.flight_type || "",
      f.max_elevation_m ?? "",
      f.distance_km ?? "",
      f.comments || f.aggregate_label || "",
    ]
      .map(escape)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export interface ParsedFlightRow {
  flight_date: string;
  duration_minutes: number;
  site: string | null;
  wing: string | null;
  flight_type: string | null;
  max_elevation_m: number | null;
  distance_km: number | null;
  comments: string | null;
}

function parseCsvLines(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

function normalizeDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return null;
}

function parseDurationMinutes(hms: string | undefined, minutes: string | undefined): number | null {
  if (minutes && minutes.trim() !== "") {
    const n = Number(minutes.trim());
    if (Number.isFinite(n)) return Math.round(n);
  }
  if (hms && hms.includes(":")) {
    const [h, m] = hms.split(":").map((s) => Number(s.trim()));
    if (Number.isFinite(h) && Number.isFinite(m)) return h * 60 + m;
  }
  return null;
}

export function parseFlightsCSV(text: string): ParsedFlightRow[] {
  const rows = parseCsvLines(text.trim());
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (...names: string[]) => {
    for (const name of names) {
      const i = header.indexOf(name);
      if (i >= 0) return i;
    }
    return -1;
  };

  const dateIdx = idx("date", "flight_date");
  const hmsIdx = idx("duration_hms", "duration");
  const minutesIdx = idx("duration_minutes");
  const siteIdx = idx("site", "venue");
  const wingIdx = idx("wing");
  const typeIdx = idx("flight_type", "type");
  const elevIdx = idx("max_elevation_m", "elevation");
  const distIdx = idx("distance_km", "distance");
  const commentsIdx = idx("comments", "description");

  const cell = (cols: string[], i: number) => (i >= 0 && cols[i] != null ? cols[i].trim() : "");

  const out: ParsedFlightRow[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const dateRaw = cell(cols, dateIdx);
    if (!dateRaw) continue;
    const flight_date = normalizeDate(dateRaw);
    const duration_minutes = parseDurationMinutes(cell(cols, hmsIdx), cell(cols, minutesIdx));
    if (!flight_date || duration_minutes === null || duration_minutes <= 0) continue;

    out.push({
      flight_date,
      duration_minutes,
      site: cell(cols, siteIdx) || null,
      wing: cell(cols, wingIdx) || null,
      flight_type: cell(cols, typeIdx) || null,
      max_elevation_m: cell(cols, elevIdx) ? Number(cell(cols, elevIdx)) : null,
      distance_km: cell(cols, distIdx) ? Number(cell(cols, distIdx)) : null,
      comments: cell(cols, commentsIdx) || null,
    });
  }
  return out;
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
