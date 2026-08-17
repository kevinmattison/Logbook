"use client";
import { useState } from "react";
import SignaturePad from "@/components/SignaturePad";
import { CONFIRMATIONS } from "@/lib/indemnityText";

type ConfirmationKey = (typeof CONFIRMATIONS)[number]["key"];

export default function IndemnityForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmations, setConfirmations] = useState<Record<ConfirmationKey, boolean>>({
    confirmed_adult: false,
    confirmed_risk: false,
    confirmed_insurance: false,
    confirmed_signature: false,
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allConfirmed = Object.values(confirmations).every(Boolean);
  const canSubmit = name.trim() && email.trim() && phone.trim() && allConfirmed && signature;

  function toggleConfirmation(key: ConfirmationKey) {
    setConfirmations((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Fill in your details, tick every confirmation, and sign before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/indemnity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passenger_name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          ...confirmations,
          signature_data_url: signature,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit the form.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-skylight rounded-lg p-5">
        <p className="font-display font-medium text-dusk mb-1">Thanks, {name.trim()}.</p>
        <p className="text-haze text-sm">
          Your signed indemnity has been recorded and a copy has been emailed to {email.trim()}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-skylight rounded-lg p-5">
      <p className="font-display font-medium text-dusk mb-4">Passenger details and signature</p>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm text-haze flex flex-col gap-1">
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-skylight rounded-md px-3 py-2 text-dusk"
          />
        </label>
        <label className="text-sm text-haze flex flex-col gap-1">
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-skylight rounded-md px-3 py-2 text-dusk"
          />
        </label>
        <label className="text-sm text-haze flex flex-col gap-1">
          Telephone number
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border border-skylight rounded-md px-3 py-2 text-dusk"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        {CONFIRMATIONS.map((c) => (
          <label key={c.key} className="flex items-start gap-3 text-sm text-dusk">
            <input
              type="checkbox"
              checked={confirmations[c.key]}
              onChange={() => toggleConfirmation(c.key)}
              className="accent-sky mt-0.5"
            />
            <span>{c.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-5">
        <SignaturePad onChange={setSignature} />
      </div>

      <div className="flex items-center justify-end mt-4">
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="bg-dusk text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-sky transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Sign and submit"}
        </button>
      </div>

      {error && <p className="text-alert text-sm mt-3">{error}</p>}
    </form>
  );
}
