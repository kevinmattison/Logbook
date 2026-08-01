import { NextResponse } from "next/server";
import { ensureSchema, getAllFlights } from "@/lib/db";
import type { Stats } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const flights = await getAllFlights();

    const now = new Date();
    const currentYear = now.getFullYear();

    const totalMinutes = flights.reduce((sum, f) => sum + (f.duration_minutes || 0), 0);

    const dated = flights.filter((f) => f.flight_date && !f.is_aggregate);

    const ytdMinutes = dated
      .filter((f) => new Date(f.flight_date as string).getFullYear() === currentYear)
      .reduce((sum, f) => sum + f.duration_minutes, 0);

    const wingMap = new Map<string, { minutes: number; flights: number }>();
    for (const f of flights) {
      const key = f.wing || (f.is_aggregate ? "Training" : "Unknown");
      const entry = wingMap.get(key) || { minutes: 0, flights: 0 };
      entry.minutes += f.duration_minutes;
      entry.flights += 1;
      wingMap.set(key, entry);
    }
    const hours_by_wing = Array.from(wingMap.entries())
      .map(([wing, v]) => ({ wing, hours: round1(v.minutes / 60), flights: v.flights }))
      .sort((a, b) => b.hours - a.hours);

    const yearMap = new Map<string, number>();
    for (const f of dated) {
      const year = new Date(f.flight_date as string).getFullYear().toString();
      yearMap.set(year, (yearMap.get(year) || 0) + f.duration_minutes);
    }
    const hours_by_year = Array.from(yearMap.entries())
      .map(([year, minutes]) => ({ year, hours: round1(minutes / 60) }))
      .sort((a, b) => a.year.localeCompare(b.year));

    const longest_flight_minutes = flights.reduce(
      (max, f) => (f.is_aggregate ? max : Math.max(max, f.duration_minutes)),
      0
    );

    const elevations = flights
      .filter((f) => f.max_elevation_m != null)
      .map((f) => Number(f.max_elevation_m));
    const highest_elevation_m = elevations.length ? Math.max(...elevations) : null;

    const siteMap = new Map<string, { flights: number; minutes: number }>();
    for (const f of flights) {
      if (!f.site) continue;
      const key = f.site.trim();
      const entry = siteMap.get(key) || { flights: 0, minutes: 0 };
      entry.flights += 1;
      entry.minutes += f.duration_minutes;
      siteMap.set(key, entry);
    }
    const top_sites = Array.from(siteMap.entries())
      .map(([site, v]) => ({ site, flights: v.flights, hours: round1(v.minutes / 60) }))
      .sort((a, b) => b.flights - a.flights)
      .slice(0, 8);

    const xc_flights = flights.filter((f) =>
      (f.comments || "").toLowerCase().includes("xc") ||
      (f.comments || "").toLowerCase().includes("cross country")
    ).length;

    const stats: Stats = {
      total_hours: round1(totalMinutes / 60),
      ytd_hours: round1(ytdMinutes / 60),
      total_flights: flights.filter((f) => !f.is_aggregate).length + 35,
      current_year: currentYear,
      hours_by_wing,
      hours_by_year,
      longest_flight_minutes,
      highest_elevation_m,
      top_sites,
      xc_flights,
    };

    return NextResponse.json({ stats });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not compute stats.", detail: err?.message },
      { status: 500 }
    );
  }
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
