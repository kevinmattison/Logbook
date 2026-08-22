"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CONFIRMATIONS } from "@/lib/indemnityText";
import type { IndemnityForm } from "@/lib/types";

export default function SignedFormsPage() {
  const [forms, setForms] = useState<IndemnityForm[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<IndemnityForm | null>(null);

  useEffect(() => {
    fetch("/api/indemnity")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load signed forms.");
        setForms(data.forms);
      })
      .catch((err) => setError(err.message || "Something went wrong."));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/indemnity" className="text-sky text-sm hover:underline">
          ← Back to indemnity form
        </Link>
        <Link href="/" className="text-sky text-sm hover:underline">
          Flight log →
        </Link>
      </div>

      <div>
        <p className="font-display text-haze tracking-[0.2em] uppercase text-xs mb-2">
          Tandem passenger indemnity
        </p>
        <h1 className="font-display text-2xl font-bold text-dusk">Signed forms</h1>
      </div>

      {error && (
        <div className="bg-alert/10 border border-alert/30 text-alert rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-skylight rounded-lg overflow-hidden">
        <div className="p-5 border-b border-skylight">
          <p className="font-display font-medium text-dusk">
            Signed indemnities{" "}
            <span className="text-haze font-body font-normal">({forms ? forms.length : "…"})</span>
          </p>
        </div>

        {forms && forms.length === 0 && (
          <p className="text-haze text-sm p-5">No indemnity forms have been signed yet.</p>
        )}

        {forms && forms.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-haze text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Passenger</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Phone</th>
                  <th className="px-3 py-3 font-medium">Signed on</th>
                  <th className="px-3 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {forms.map((f) => (
                  <tr key={f.id} className="border-t border-skylight/70 hover:bg-skylight/40">
                    <td className="px-5 py-2.5 text-dusk">{f.passenger_name}</td>
                    <td className="px-3 py-2.5">{f.email}</td>
                    <td className="px-3 py-2.5">{f.phone}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {new Date(f.created_at).toLocaleString("en-ZA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => setViewing(f)}
                        className="text-sky text-xs hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <div
          className="fixed inset-0 bg-dusk/40 flex items-center justify-center p-6 z-50"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-medium text-dusk">{viewing.passenger_name}</p>
              <button
                onClick={() => setViewing(null)}
                className="text-haze hover:text-dusk text-sm"
              >
                Close
              </button>
            </div>

            <div className="text-sm text-dusk/90 space-y-1 mb-4">
              <p>
                <span className="text-haze">Email:</span> {viewing.email}
              </p>
              <p>
                <span className="text-haze">Phone:</span> {viewing.phone}
              </p>
              <p>
                <span className="text-haze">Signed on:</span>{" "}
                {new Date(viewing.created_at).toLocaleString("en-ZA", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <p className="font-display font-medium text-dusk mb-2 text-sm">Confirmations</p>
            <div className="space-y-2 mb-4">
              {CONFIRMATIONS.map((c) => (
                <p key={c.key} className="text-sm text-dusk/90 flex gap-2">
                  <span>{viewing[c.key] ? "✅" : "☐"}</span>
                  <span>{c.label}</span>
                </p>
              ))}
            </div>

            <p className="font-display font-medium text-dusk mb-2 text-sm">Signature</p>
            <img
              src={viewing.signature_data_url}
              alt="Passenger signature"
              className="border border-skylight rounded-md max-w-full"
            />
          </div>
        </div>
      )}
    </main>
  );
}
