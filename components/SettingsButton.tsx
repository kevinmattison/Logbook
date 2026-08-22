"use client";
import { useState } from "react";
import type { PilotSettings } from "@/lib/types";

export default function SettingsButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pilotName, setPilotName] = useState("");
  const [sahpaNumber, setSahpaNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function applySettings(settings: PilotSettings | null) {
    setPilotName(settings?.pilot_name || "");
    setSahpaNumber(settings?.sahpa_number || "");
    setEmail(settings?.email || "");
    setPhone(settings?.phone || "");
  }

  async function handleOpen() {
    setOpen(true);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load settings.");
      applySettings(data.settings);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pilot_name: pilotName.trim() || undefined,
          sahpa_number: sahpaNumber.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save settings.");
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xs md:text-sm font-display font-medium bg-skylight text-rust border border-rust/40 rounded-md px-3 py-1.5 hover:bg-white transition-colors whitespace-nowrap"
      >
        Settings
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-dusk/40 flex items-center justify-center p-6 z-50"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-medium text-dusk">Pilot settings</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-haze hover:text-dusk text-sm"
              >
                Close
              </button>
            </div>

            {loading ? (
              <p className="text-haze text-sm">Loading…</p>
            ) : (
              <div className="flex flex-col gap-4">
                <label className="text-sm text-haze flex flex-col gap-1">
                  Pilot name
                  <input
                    type="text"
                    value={pilotName}
                    onChange={(e) => setPilotName(e.target.value)}
                    className="border border-skylight rounded-md px-3 py-2 text-dusk"
                  />
                </label>
                <label className="text-sm text-haze flex flex-col gap-1">
                  SAHPA number
                  <input
                    type="text"
                    value={sahpaNumber}
                    onChange={(e) => setSahpaNumber(e.target.value)}
                    className="border border-skylight rounded-md px-3 py-2 text-dusk"
                  />
                </label>
                <label className="text-sm text-haze flex flex-col gap-1">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-skylight rounded-md px-3 py-2 text-dusk"
                  />
                </label>
                <label className="text-sm text-haze flex flex-col gap-1">
                  Cell phone number
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-skylight rounded-md px-3 py-2 text-dusk"
                  />
                </label>
              </div>
            )}

            {error && <p className="text-alert text-sm mt-3">{error}</p>}

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                disabled={saving || loading}
                className="bg-dusk text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-sky transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save settings"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
