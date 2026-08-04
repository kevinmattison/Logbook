"use client";
import { useMemo, useState } from "react";
import type { Flight } from "@/lib/types";
import { COMMON_SITES } from "@/lib/sites";

export default function FlightForm({
  onAdded,
  knownSites = [],
}: {
  onAdded: (f: Flight) => void;
  knownSites?: string[];
}) {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [site, setSite] = useState("");
  const [wing, setWing] = useState("");
  const [comments, setComments] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [elevation, setElevation] = useState("");
  const [distance, setDistance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const siteOptions = useMemo(() => {
    const merged = new Set([...COMMON_SITES, ...knownSites]);
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
  }, [knownSites]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const durationMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0);
    if (!date || durationMinutes <= 0) {
      setError("Enter a date and a duration greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight_date: date,
          duration_minutes: durationMinutes,
          site: site || undefined,
          wing: wing || undefined,
          comments: comments || undefined,
          max_elevation_m: elevation || undefined,
          distance_km: distance || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save flight.");
      onAdded(data.flight);
      setDate("");
      setHours("");
      setMinutes("");
      setSite("");
      setWing("");
      setComments("");
      setElevation("");
      setDistance("");
      setShowMore(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-skylight rounded-lg p-5">
      <p className="font-display font-medium text-dusk mb-4">Log a flight</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="text-sm text-haze flex flex-col gap-1">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border border-skylight rounded-md px-3 py-2 text-dusk"
          />
        </label>

        <label className="text-sm text-haze flex flex-col gap-1">
          Duration
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="hrs"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="border border-skylight rounded-md px-3 py-2 text-dusk w-full"
            />
            <input
              type="number"
              min={0}
              max={59}
              placeholder="min"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="border border-skylight rounded-md px-3 py-2 text-dusk w-full"
            />
          </div>
        </label>

        <label className="text-sm text-haze flex flex-col gap-1">
          Venue / site
          <input
            type="text"
            list="site-options"
            placeholder="Select or type a new site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="border border-skylight rounded-md px-3 py-2 text-dusk"
          />
          <datalist id="site-options">
            {siteOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>

        <label className="text-sm text-haze flex flex-col gap-1">
          Wing
          <input
            type="text"
            placeholder="e.g. Arak"
            value={wing}
            onChange={(e) => setWing(e.target.value)}
            className="border border-skylight rounded-md px-3 py-2 text-dusk"
          />
        </label>
      </div>

      <label className="text-sm text-haze flex flex-col gap-1 mt-4">
        Description
        <textarea
          placeholder="What happened on this flight?"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={2}
          className="border border-skylight rounded-md px-3 py-2 text-dusk resize-none"
        />
      </label>

      {showMore && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <label className="text-sm text-haze flex flex-col gap-1">
            Max elevation (m)
            <input
              type="number"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
              className="border border-skylight rounded-md px-3 py-2 text-dusk"
            />
          </label>
          <label className="text-sm text-haze flex flex-col gap-1">
            Distance (km)
            <input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="border border-skylight rounded-md px-3 py-2 text-dusk"
            />
          </label>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="text-sky text-sm hover:underline"
        >
          {showMore ? "Hide" : "Add"} elevation / distance
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="bg-dusk text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-sky transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save flight"}
        </button>
      </div>

      {error && <p className="text-alert text-sm mt-3">{error}</p>}
    </form>
  );
}
