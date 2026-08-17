"use client";
import { useMemo, useState } from "react";
import type { Flight } from "@/lib/types";

type SortKey = "flights" | "hours" | "longest" | "average";

interface VenueStat {
  site: string;
  flights: number;
  hours: number;
  longestMinutes: number;
  averageMinutes: number;
}

export default function VenuesTable({ flights }: { flights: Flight[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("flights");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const venues = useMemo(() => {
    const siteMap = new Map<string, { flights: number; minutes: number; longest: number }>();
    for (const f of flights) {
      if (f.is_aggregate || !f.site) continue;
      const key = f.site.trim();
      if (!key) continue;
      const entry = siteMap.get(key) || { flights: 0, minutes: 0, longest: 0 };
      entry.flights += 1;
      entry.minutes += f.duration_minutes;
      entry.longest = Math.max(entry.longest, f.duration_minutes);
      siteMap.set(key, entry);
    }

    const list: VenueStat[] = Array.from(siteMap.entries()).map(([site, v]) => ({
      site,
      flights: v.flights,
      hours: Math.round((v.minutes / 60) * 10) / 10,
      longestMinutes: v.longest,
      averageMinutes: Math.round(v.minutes / v.flights),
    }));

    return list.sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortKey === "flights") {
        av = a.flights;
        bv = b.flights;
      } else if (sortKey === "hours") {
        av = a.hours;
        bv = b.hours;
      } else if (sortKey === "longest") {
        av = a.longestMinutes;
        bv = b.longestMinutes;
      } else {
        av = a.averageMinutes;
        bv = b.averageMinutes;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [flights, sortKey, sortDir]);

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
      <div className="p-5 border-b border-skylight">
        <p className="font-display font-medium text-dusk">
          Venues <span className="text-haze font-body font-normal">({venues.length})</span>
        </p>
      </div>

      {venues.length === 0 ? (
        <p className="text-haze text-sm p-5">No venues logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-haze text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Site</th>
                <th
                  className="px-3 py-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("flights")}
                >
                  Flights {sortKey === "flights" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-3 py-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("hours")}
                >
                  Total airtime {sortKey === "hours" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-3 py-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("longest")}
                >
                  Longest flight {sortKey === "longest" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-3 py-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("average")}
                >
                  Average flight {sortKey === "average" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.site} className="border-t border-skylight/70 hover:bg-skylight/40">
                  <td className="px-5 py-2.5 text-dusk">{v.site}</td>
                  <td className="px-3 py-2.5 font-mono tabular-nums">{v.flights}</td>
                  <td className="px-3 py-2.5 font-mono tabular-nums whitespace-nowrap">
                    {v.hours}
                    <span className="text-xs font-body text-haze ml-1">hrs</span>
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums whitespace-nowrap">
                    {formatHM(v.longestMinutes)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums whitespace-nowrap">
                    {formatHM(v.averageMinutes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatHM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}
