"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", score: 80 },
  { name: "Tue", score: 60 },
  { name: "Wed", score: 90 },
  { name: "Thu", score: 50 },
  { name: "Fri", score: 85 },
  { name: "Sat", score: 70 },
  { name: "Sun", score: 95 },
];

export default function HealthChart() {
  return (
    <div className="glass p-6">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
          <YAxis stroke="rgba(255,255,255,0.3)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              borderRadius: "10px",
              border: "none",
              color: "white",
            }}
          />
          <Line type="monotone" dataKey="score" stroke="var(--purple)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-purple font-bold text-xl mt-3">
        98.2% <span className="text-sm text-gray-400">Health Score</span>
      </p>
    </div>
  );
}
