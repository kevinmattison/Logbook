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
