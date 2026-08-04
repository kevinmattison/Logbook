"use client";
import { useMemo, useState } from "react";
import type { Flight } from "@/lib/types";

export default function DateRangeStats({ flights }: { flights: Flight[] }) {
  const dated = useMemo(() => flights.filter((f) => f.flight_date && !f.is_aggregate), [flights]);

  const bounds = useMemo(() => {
    if (dated.length === 0) return null;
    const dates = dated.map((f) => f.flight_date as string).sort();
    return { min: dates[0], max: dates[dates.length - 1] };
  }, [dated]);

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const rangeStats = useMemo(() => {
    if (!from && !to) return null;
    const fromTime = from ? new Date(from).getTime() : -Infinity;
    const toTime = to ? new Date(to).getTime() : Infinity;

    const inRange = dated.filter((f) => {
      const t = new Date(f.flight_date as string).getTime();
      return t >= fromTime && t <= toTime;
    });

    const totalMinutes = inRange.reduce((sum, f) => sum + f.duration_minutes, 0);
    const longest = inRange.reduce((max, f) => Math.max(max, f.duration_minutes), 0);
    const elevations = inRange
      .filter((f) => f.max_elevation_m != null)
      .map((f) => Number(f.max_elevation_m));
    const highest = elevations.length ? Math.max(...elevations) : null;

    return {
      count: inRange.length,
      hours: Math.round((totalMinutes / 60) * 10) / 10,
      longestMinutes: longest,
      highestElevation: highest,
    };
  }, [dated, from, to]);

  function quickRange(months: number) {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setFrom(start.toISOString().slice(0, 10));
    setTo(end.toISOString().slice(0, 10));
  }

  return (
    <div className="bg-white border border-skylight rounded-lg p-5">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <p className="font-display font-medium text-dusk mb-1">Stats for a date range</p>
          {bounds && (
            <p className="text-haze text-xs">
              Logged flights span {formatDate(bounds.min)} – {formatDate(bounds.max)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-haze flex flex-col gap-1">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-skylight rounded-md px-3 py-1.5 text-sm text-dusk"
            />
          </label>
          <label className="text-xs text-haze flex flex-col gap-1">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-skylight rounded-md px-3 py-1.5 text-sm text-dusk"
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => quickRange(1)}
              className="text-xs border border-skylight rounded-md px-2.5 py-1.5 text-haze hover:bg-skylight/40"
            >
              Last month
            </button>
            <button
              onClick={() => quickRange(12)}
              className="text-xs border border-skylight rounded-md px-2.5 py-1.5 text-haze hover:bg-skylight/40"
            >
              Last year
            </button>
            {(from || to) && (
              <button
                onClick={() => {
                  setFrom("");
                  setTo("");
                }}
                className="text-xs text-haze hover:text-alert px-2.5 py-1.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {rangeStats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RangeStat label="Flights" value={String(rangeStats.count)} />
          <RangeStat label="Total airtime" value={`${rangeStats.hours}`} unit="hrs" />
          <RangeStat label="Longest flight" value={formatHM(rangeStats.longestMinutes)} />
          <RangeStat
            label="Highest altitude"
            value={rangeStats.highestElevation ? Math.round(rangeStats.highestElevation).toLocaleString() : "—"}
            unit="m"
          />
        </div>
      ) : (
        <p className="text-haze text-sm">Pick a date range above to see flights and airtime for that period.</p>
      )}
    </div>
  );
}

function RangeStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <p className="text-haze text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="font-mono font-bold text-xl text-dusk tabular-nums">
        {value}
        {unit && <span className="text-sm font-body font-normal text-haze ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function formatHM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "2-digit" });
}
