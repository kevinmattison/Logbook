import Link from "next/link";
import SettingsButton from "@/components/SettingsButton";
import type { Stats } from "@/lib/types";

export default function Hero({ stats }: { stats: Stats | null }) {
  return (
    <div className="bg-atmosphere altimeter-tick relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <p className="font-display text-skylight/70 tracking-[0.2em] uppercase text-xs md:text-sm">
            Flight Log
          </p>
          <div className="flex items-center gap-2">
            <SettingsButton />
            <Link
              href="/indemnity/signed"
              className="text-xs md:text-sm font-display font-medium bg-skylight text-rust border border-rust/40 rounded-md px-3 py-1.5 hover:bg-white transition-colors whitespace-nowrap"
            >
              Signed forms
            </Link>
            <Link
              href="/indemnity"
              className="text-xs md:text-sm font-display font-medium bg-thermal text-dusk rounded-md px-3 py-1.5 hover:bg-thermal/90 transition-colors whitespace-nowrap"
            >
              Tandem indemnity form
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="bg-white/90 rounded-lg px-5 py-4 inline-block">
            <div className="font-mono text-dusk leading-none text-6xl md:text-8xl font-bold tabular-nums">
              {stats ? stats.total_hours.toFixed(1) : "—"}
              <span className="text-2xl md:text-4xl font-body font-normal text-dusk/70 ml-2">
                hrs
              </span>
            </div>
            <p className="text-dusk/70 mt-2 text-sm md:text-base">
              Total airtime across {stats ? stats.total_flights : "—"} flights
            </p>
          </div>
          <div className="flex gap-8 md:gap-12">
            <div className="bg-white/90 rounded-lg px-5 py-4">
              <div className="font-mono text-dusk text-3xl md:text-4xl font-bold tabular-nums">
                {stats ? stats.ytd_hours.toFixed(1) : "—"}
              </div>
              <p className="text-dusk/70 text-xs md:text-sm mt-1">
                hrs in {stats ? stats.current_year : ""} so far
              </p>
            </div>
            <div className="bg-white/90 rounded-lg px-5 py-4">
              <div className="font-mono text-dusk text-3xl md:text-4xl font-bold tabular-nums">
                {stats?.highest_elevation_m ? Math.round(stats.highest_elevation_m).toLocaleString() : "—"}
              </div>
              <p className="text-dusk/70 text-xs md:text-sm mt-1">highest altitude, m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
