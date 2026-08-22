"use client";
import { useRef, useState } from "react";
import { parseFlightsCSV, type ParsedFlightRow } from "@/lib/csv";
import type { Flight } from "@/lib/types";

type Action = "add" | "replace" | "skip";

interface ReviewItem {
  parsed: ParsedFlightRow;
  match: Flight | null;
  action: Action;
}

function toDateKey(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function findMatch(row: ParsedFlightRow, flights: Flight[]): Flight | null {
  const rowSite = (row.site || "").trim().toLowerCase();
  const rowDateKey = toDateKey(row.flight_date);
  return (
    flights.find(
      (f) =>
        !f.is_aggregate &&
        toDateKey(f.flight_date) === rowDateKey &&
        f.duration_minutes === row.duration_minutes &&
        (f.site || "").trim().toLowerCase() === rowSite
    ) || null
  );
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export default function ImportCsvButton({
  flights,
  onImported,
}: {
  flights: Flight[];
  onImported: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<ReviewItem[] | null>(null);
  const [newCount, setNewCount] = useState(0);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const parsed = parseFlightsCSV(text);
      if (parsed.length === 0) {
        setError("No valid rows found in that CSV file.");
        return;
      }

      const reviewItems: ReviewItem[] = parsed.map((row) => {
        const match = findMatch(row, flights);
        return { parsed: row, match, action: match ? "skip" : "add" };
      });

      const duplicates = reviewItems.filter((it) => it.match);
      const newOnes = reviewItems.filter((it) => !it.match);
      setNewCount(newOnes.length);

      if (duplicates.length === 0) {
        await runImport(reviewItems);
      } else {
        setItems(reviewItems);
      }
    } catch (err: any) {
      setError(err.message || "Could not read that CSV file.");
    }
  }

  function setActionForIndex(index: number, action: Action) {
    setItems((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = { ...next[index], action };
      return next;
    });
  }

  function setActionForAllDuplicates(action: Action) {
    setItems((prev) =>
      prev ? prev.map((it) => (it.match ? { ...it, action } : it)) : prev
    );
  }

  async function runImport(toRun: ReviewItem[]) {
    setImporting(true);
    setError(null);
    let added = 0;
    let replaced = 0;
    let skipped = 0;

    for (const item of toRun) {
      if (item.action === "skip") {
        skipped++;
        continue;
      }
      try {
        if (item.action === "replace" && item.match) {
          const res = await fetch(`/api/flights/${item.match.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.parsed),
          });
          if (!res.ok) throw new Error("replace failed");
          replaced++;
        } else {
          const res = await fetch("/api/flights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.parsed),
          });
          if (!res.ok) throw new Error("add failed");
          added++;
        }
      } catch {
        skipped++;
      }
    }

    setImporting(false);
    setItems(null);
    setResult(`Imported ${added} new flight${added === 1 ? "" : "s"}, replaced ${replaced}, skipped ${skipped}.`);
    onImported();
  }

  const duplicateItems = items ? items.filter((it) => it.match) : [];

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-sm border border-skylight text-dusk rounded-md px-3 py-1.5 hover:bg-skylight/40 whitespace-nowrap"
      >
        Import CSV
      </button>

      {error && <p className="text-alert text-xs mt-1">{error}</p>}
      {result && <p className="text-ridge text-xs mt-1">{result}</p>}

      {items && (
        <div className="fixed inset-0 bg-dusk/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <p className="font-display font-medium text-dusk mb-1">Review import</p>
            <p className="text-haze text-sm mb-4">
              {newCount} new flight{newCount === 1 ? "" : "s"} will be added.{" "}
              {duplicateItems.length} row{duplicateItems.length === 1 ? "" : "s"} look
              {duplicateItems.length === 1 ? "s" : ""} like an existing flight — decide what to do
              with each below.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-haze">Set all duplicates to:</span>
              <button
                onClick={() => setActionForAllDuplicates("replace")}
                className="text-xs border border-skylight rounded-md px-2.5 py-1 text-dusk hover:bg-skylight/40"
              >
                Replace
              </button>
              <button
                onClick={() => setActionForAllDuplicates("add")}
                className="text-xs border border-skylight rounded-md px-2.5 py-1 text-dusk hover:bg-skylight/40"
              >
                Add anyway
              </button>
              <button
                onClick={() => setActionForAllDuplicates("skip")}
                className="text-xs border border-skylight rounded-md px-2.5 py-1 text-dusk hover:bg-skylight/40"
              >
                Skip
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {items.map((item, i) => {
                if (!item.match) return null;
                return (
                  <div
                    key={i}
                    className="border border-skylight rounded-md p-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="text-dusk">
                        {item.parsed.flight_date} · {formatDuration(item.parsed.duration_minutes)} ·{" "}
                        {item.parsed.site || "—"}
                      </p>
                      <p className="text-haze text-xs">
                        Matches existing flight #{item.match.flight_number ?? item.match.id}
                      </p>
                    </div>
                    <div className="flex gap-3 whitespace-nowrap">
                      {(["replace", "add", "skip"] as Action[]).map((a) => (
                        <label key={a} className="flex items-center gap-1 text-xs text-dusk">
                          <input
                            type="radio"
                            name={`action-${i}`}
                            checked={item.action === a}
                            onChange={() => setActionForIndex(i, a)}
                            className="accent-sky"
                          />
                          {a === "add" ? "Add anyway" : a === "replace" ? "Replace" : "Skip"}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItems(null)}
                className="text-sm text-haze hover:text-alert px-3 py-2"
              >
                Cancel import
              </button>
              <button
                onClick={() => runImport(items)}
                disabled={importing}
                className="bg-dusk text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-sky transition-colors disabled:opacity-50"
              >
                {importing ? "Importing…" : "Confirm import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
