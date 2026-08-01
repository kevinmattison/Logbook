"use client";

const COLORS = ["#3E7CB1", "#E8A23D", "#4F8A6D", "#7B93A8", "#C1553D", "#16233A"];

export default function WingChart({
  data,
}: {
  data: { wing: string; hours: number; flights: number }[];
}) {
  const max = Math.max(...data.map((d) => d.hours), 1);
  return (
    <div className="bg-white border border-skylight rounded-lg p-5">
      <p className="font-display font-medium text-dusk mb-4">Hours by wing</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.wing}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-dusk font-medium">{d.wing}</span>
              <span className="font-mono text-haze tabular-nums">
                {d.hours}h · {d.flights} flights
              </span>
            </div>
            <div className="h-2 rounded-full bar-track overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(d.hours / max) * 100}%`,
                  background: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
