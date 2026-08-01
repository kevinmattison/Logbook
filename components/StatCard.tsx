export default function StatCard({
  label,
  value,
  unit,
  accent = "dusk",
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "dusk" | "thermal" | "sky" | "ridge";
}) {
  const accentClass = {
    dusk: "text-dusk",
    thermal: "text-thermal",
    sky: "text-sky",
    ridge: "text-ridge",
  }[accent];

  return (
    <div className="bg-white border border-skylight rounded-lg px-5 py-4">
      <p className="text-haze text-xs uppercase tracking-wide mb-2">{label}</p>
      <p className={`font-mono font-bold text-2xl tabular-nums ${accentClass}`}>
        {value}
        {unit && <span className="text-sm font-body font-normal text-haze ml-1">{unit}</span>}
      </p>
    </div>
  );
}
