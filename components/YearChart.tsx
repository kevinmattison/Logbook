"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function YearChart({ data }: { data: { year: string; hours: number }[] }) {
  return (
    <div className="bg-white border border-skylight rounded-lg p-5">
      <p className="font-display font-medium text-dusk mb-4">Hours per year</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid stroke="#EAF1F6" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#7B93A8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#7B93A8" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "#EAF1F6" }}
              contentStyle={{ borderRadius: 8, border: "1px solid #EAF1F6", fontSize: 13 }}
              formatter={(v: number) => [`${v} hrs`, "Airtime"]}
            />
            <Bar dataKey="hours" fill="#3E7CB1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
