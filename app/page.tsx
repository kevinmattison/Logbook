"use client";
import { useEffect, useState, useCallback } from "react";
import Hero from "@/components/Hero";
import StatCard from "@/components/StatCard";
import YearChart from "@/components/YearChart";
import WingChart from "@/components/WingChart";
import FlightForm from "@/components/FlightForm";
import FlightTable from "@/components/FlightTable";
import DateRangeStats from "@/components/DateRangeStats";
import VenuesTable from "@/components/VenuesTable";
import type { Flight, Stats } from "@/lib/types";

type Tab = "log" | "venues";

export default function Home() {
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("log");

  const load = useCallback(async () => {
    try {
      const [flightsRes, statsRes] = await Promise.all([
        fetch("/api/flights"),
        fetch("/api/stats"),
      ]);
      const flightsData = await flightsRes.json();
      const statsData = await statsRes.json();
      if (!flightsRes.ok) throw new Error(flightsData.error || "Could not load flights");
      if (!statsRes.ok) throw new Error(statsData.error || "Could not load stats");
      setFlights(flightsData.flights);
      setStats(statsData.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong loading your logbook.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const knownSites = flights
    ? Array.from(new Set(flights.map((f) => f.site).filter((s): s is string => Boolean(s))))
    : [];

  function handleAdded(flight: Flight) {
    setFlights((prev) => (prev ? [flight, ...prev] : [flight]));
    load(); // refresh stats now that a new flight is in
  }

  async function handleDelete(id: number) {
    const prev = flights;
    setFlights((f) => (f ? f.filter((x) => x.id !== id) : f));
    const res = await fetch(`/api/flights/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setFlights(prev || null);
    } else {
      load();
    }
  }

  return (
    <main>
      <Hero stats={stats} />

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {error && (
          <div className="bg-alert/10 border border-alert/30 text-alert rounded-lg px-4 py-3 text-sm">
            {error}. If this is a fresh deployment, make sure the database is connected and
            seeded — see the README for setup steps.
          </div>
        )}

        <div className="flex gap-6 border-b border-skylight">
          {(["log", "venues"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 -mb-px text-sm font-display font-medium border-b-2 transition-colors ${
                tab === t
                  ? "text-dusk border-sky"
                  : "text-haze border-transparent hover:text-dusk"
              }`}
            >
              {t === "log" ? "Log" : "Venues"}
            </button>
          ))}
        </div>

        {tab === "log" ? (
          <>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total flights" value={String(stats.total_flights)} accent="dusk" />
                <StatCard
                  label="Longest flight"
                  value={formatHM(stats.longest_flight_minutes)}
                  accent="sky"
                />
                <StatCard label="XC flights" value={String(stats.xc_flights)} accent="ridge" />
                <StatCard
                  label="Highest altitude"
                  value={stats.highest_elevation_m ? Math.round(stats.highest_elevation_m).toLocaleString() : "—"}
                  unit="m"
                  accent="thermal"
                />
              </div>
            )}

            {stats && (
              <div className="grid md:grid-cols-2 gap-4">
                <YearChart data={stats.hours_by_year} />
                <WingChart data={stats.hours_by_wing} />
              </div>
            )}

            {flights && <DateRangeStats flights={flights} />}

            <FlightForm onAdded={handleAdded} knownSites={knownSites} />

            {flights ? (
              <FlightTable flights={flights} onDelete={handleDelete} />
            ) : (
              !error && <p className="text-haze text-sm">Loading your logbook…</p>
            )}
          </>
        ) : flights ? (
          <VenuesTable flights={flights} />
        ) : (
          !error && <p className="text-haze text-sm">Loading your logbook…</p>
        )}
      </div>

      <footer className="text-center text-haze text-xs py-8">
        Flight log — built for tracking airtime, one launch at a time.
      </footer>
    </main>
  );
}

function formatHM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}
