import Link from "next/link";
import IndemnityForm from "@/components/IndemnityForm";
import { INDEMNITY_SECTIONS, PILOT_NAME } from "@/lib/indemnityText";

export const metadata = {
  title: "Tandem Passenger Indemnity — Flight Log",
};

export default function IndemnityPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <Link href="/" className="text-sky text-sm hover:underline">
        ← Back to flight log
      </Link>

      <div>
        <p className="font-display text-haze tracking-[0.2em] uppercase text-xs mb-2">
          Tandem passenger indemnity
        </p>
        <h1 className="font-display text-2xl font-bold text-dusk">Indemnity and Release Form</h1>
        <p className="text-haze text-sm mt-1">Pilot: {PILOT_NAME}</p>
      </div>

      <div className="bg-white border border-skylight rounded-lg p-5 space-y-5">
        {INDEMNITY_SECTIONS.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <p className="font-display font-medium text-dusk mb-2">{section.heading}</p>
            )}
            <div className="space-y-2">
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-sm text-dusk/90 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <IndemnityForm />
    </main>
  );
}
