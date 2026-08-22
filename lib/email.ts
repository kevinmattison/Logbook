import { Resend } from "resend";
import { buildIndemnitySections, CONFIRMATIONS, DEFAULT_PILOT_NAME } from "./indemnityText";
import type { IndemnityForm, PilotSettings } from "./types";

const WITNESS_EMAIL = "k_mattison@icloud.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderIndemnityEmail(form: IndemnityForm, settings: PilotSettings | null) {
  const pilotName = settings?.pilot_name || DEFAULT_PILOT_NAME;
  const signedAt = new Date(form.created_at).toLocaleString("en-ZA", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const sections = buildIndemnitySections(pilotName)
    .map((section) => {
      const heading = section.heading
        ? `<p style="font-weight:600;margin:16px 0 8px;">${section.heading}</p>`
        : "";
      const paragraphs = section.paragraphs
        .map((p) => `<p style="margin:0 0 8px;line-height:1.5;">${p}</p>`)
        .join("");
      return heading + paragraphs;
    })
    .join("");

  const confirmations = CONFIRMATIONS.map((c) => {
    const checked = Boolean(form[c.key]);
    const mark = checked ? "&#9989;" : "&#9744;";
    return `<p style="margin:0 0 8px;line-height:1.5;">${mark} ${escapeHtml(c.label)}</p>`;
  }).join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#16233A;max-width:640px;">
      <h1 style="font-size:18px;">Indemnity and Release Form — Signed Copy</h1>
      <p><strong>Pilot:</strong> ${escapeHtml(pilotName)}${
    settings?.sahpa_number ? ` (SAHPA No. ${escapeHtml(settings.sahpa_number)})` : ""
  }</p>
      <p><strong>Passenger:</strong> ${escapeHtml(form.passenger_name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(form.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(form.phone)}</p>
      <p><strong>Signed on:</strong> ${signedAt}</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #EAF1F6;" />
      ${sections}
      <hr style="margin:20px 0;border:none;border-top:1px solid #EAF1F6;" />
      <p style="font-weight:600;margin:0 0 8px;">Confirmations accepted by the passenger</p>
      ${confirmations}
      <hr style="margin:20px 0;border:none;border-top:1px solid #EAF1F6;" />
      <p style="font-weight:600;">Passenger signature</p>
      <img src="${form.signature_data_url}" alt="Passenger signature" style="max-width:320px;border:1px solid #EAF1F6;border-radius:6px;" />
    </div>
  `;
}

export async function sendIndemnityCopy(
  form: IndemnityForm,
  settings: PilotSettings | null
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping indemnity email.");
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const html = renderIndemnityEmail(form, settings);
  const subject = `Signed tandem indemnity — ${form.passenger_name}`;

  const recipients = Array.from(new Set([form.email, WITNESS_EMAIL]));

  const results = await Promise.allSettled(
    recipients.map((to) => resend.emails.send({ from, to, subject, html }))
  );

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`Could not email indemnity copy to ${recipients[i]}:`, result.reason);
    }
  });
}
