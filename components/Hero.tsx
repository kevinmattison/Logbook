import Link from "next/link";
import type { Stats } from "@/lib/types";

export default function Hero({ stats }: { stats: Stats | null }) {
  return (
    <div className="bg-atmosphere altimeter-tick relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-skylight/70 tracking-[0.2em] uppercase text-xs md:text-sm">
            Flight Log
          </p>
          <Link
            href="/indemnity"
            className="text-xs md:text-sm font-display font-medium bg-thermal text-dusk rounded-md px-3 py-1.5 hover:bg-thermal/90 transition-colors whitespace-nowrap"
          >
            Tandem indemnity form
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="font-mono text-skylight leading-none text-6xl md:text-8xl font-bold tabular-nums">
              {stats ? stats.total_hours.toFixed(1) : "—"}
              <span className="text-2xl md:text-4xl font-body font-normal text-skylight/70 ml-2">
                hrs
              </span>
            </div>
            <p className="text-skylight/80 mt-2 text-sm md:text-base">
              Total airtime across {stats ? stats.total_flights : "—"} flights
            </p>
          </div>
          <div className="flex gap-8 md:gap-12">
            <div>
              <div className="font-mono text-thermal text-3xl md:text-4xl font-bold tabular-nums">
                {stats ? stats.ytd_hours.toFixed(1) : "—"}
              </div>
              <p className="text-skylight/70 text-xs md:text-sm mt-1">
                hrs in {stats ? stats.current_year : ""} so far
              </p>
            </div>
            <div>
              <div className="font-mono text-skylight text-3xl md:text-4xl font-bold tabular-nums">
                {stats?.highest_elevation_m ? Math.round(stats.highest_elevation_m).toLocaleString() : "—"}
              </div>
              <p className="text-skylight/70 text-xs md:text-sm mt-1">highest altitude, m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
