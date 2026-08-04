"use client";
import { useMemo, useState } from "react";
import type { Flight } from "@/lib/types";
import { flightsToCSV, downloadCSV } from "@/lib/csv";

type SortKey = "date" | "duration" | "elevation";

export default function FlightTable({
  flights,
  onDelete,
}: {
  flights: Flight[];
  onDelete: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const maxElevation = useMemo(
    () => Math.max(...flights.map((f) => Number(f.max_elevation_m) || 0), 1),
    [flights]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = flights.filter((f) => {
      if (!q) return true;
      return (
        (f.site || "").toLowerCase().includes(q) ||
        (f.wing || "").toLowerCase().includes(q) ||
        (f.comments || "").toLowerCase().includes(q) ||
        (f.aggregate_label || "").toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortKey === "date") {
        av = a.flight_date ? new Date(a.flight_date).getTime() : 0;
        bv = b.flight_date ? new Date(b.flight_date).getTime() : 0;
      } else if (sortKey === "duration") {
        av = a.duration_minutes;
        bv = b.duration_minutes;
      } else {
        av = Number(a.max_elevation_m) || 0;
        bv = Number(b.max_elevation_m) || 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });

    return list;
  }, [flights, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="bg-white border border-skylight rounded-lg overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-4 border-b border-skylight">
        <p className="font-display font-medium text-dusk">
          Flight log <span className="text-haze font-body font-normal">({filtered.length})</span>
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search site, wing, description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-skylight rounded-md px-3 py-1.5 text-sm text-dusk w-56"
          />
          <button
            onClick={() => {
              const csv = flightsToCSV(filtered);
              downloadCSV(`flight-log-export-${new Date().toISOString().slice(0, 10)}.csv`, csv);
            }}
            className="text-sm border border-skylight text-dusk rounded-md px-3 py-1.5 hover:bg-skylight/40 whitespace-nowrap"
            title="Export the flights currently shown (respects search/sort) as a CSV file"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-haze text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">#</th>
              <th
                className="px-3 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                Date {sortKey === "date" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-3 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("duration")}
              >
                Duration {sortKey === "duration" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-3 py-3 font-medium">Site</th>
              <th className="px-3 py-3 font-medium">Wing</th>
              <th
                className="px-3 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("elevation")}
              >
                Max elev. {sortKey === "elevation" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-3 py-3 font-medium">Description</th>
              <th className="px-3 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-t border-skylight/70 hover:bg-skylight/40">
                <td className="px-5 py-2.5 font-mono text-haze">
                  {f.is_aggregate ? "1–35" : f.flight_number}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {f.flight_date
                    ? new Date(f.flight_date).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-3 py-2.5 font-mono tabular-nums whitespace-nowrap">
                  {formatDuration(f.duration_minutes)}
                </td>
                <td className="px-3 py-2.5">{f.site || "—"}</td>
                <td className="px-3 py-2.5">{f.wing || "—"}</td>
                <td className="px-3 py-2.5">
                  {f.max_elevation_m ? (
                    <div className="flex items-center gap-2 w-28">
                      <div className="h-1.5 flex-1 rounded-full bar-track overflow-hidden">
                        <div
                          className="h-full rounded-full bg-thermal"
                          style={{
                            width: `${(Number(f.max_elevation_m) / maxElevation) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs text-haze tabular-nums">
                        {Math.round(Number(f.max_elevation_m))}
                      </span>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2.5 text-dusk/80 max-w-xs truncate" title={f.comments || f.aggregate_label || ""}>
                  {f.comments || f.aggregate_label || "—"}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {!f.is_aggregate && (
                    <button
                      onClick={() => onDelete(f.id)}
                      className="text-haze hover:text-alert text-xs"
                      aria-label={`Delete flight ${f.flight_number}`}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}
