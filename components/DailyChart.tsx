"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import type { DailyRow } from "@/lib/types";
import { useState } from "react";

interface Props {
  data: DailyRow[];
}

const METRICS = [
  { key: "cost", label: "비용 (₩)", color: "#FACC15" },
  { key: "impressions", label: "노출수", color: "#60A5FA" },
  { key: "clicks", label: "클릭수", color: "#34D399" },
] as const;

export default function DailyChart({ data }: Props) {
  const [active, setActive] = useState<string>("cost");

  const metric = METRICS.find((m) => m.key === active)!;

  const formatted = data.map((d) => ({
    ...d,
    date: d.date.replace("2024.", "").replace(".", "/"),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">일별 추이</h3>
        <div className="flex gap-2">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                active === m.key
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={active === m.key ? { backgroundColor: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) =>
              active === "cost" ? `₩${(v / 1000).toFixed(0)}k` : v.toLocaleString()
            }
          />
          <Tooltip
            formatter={(v) => {
              const num = typeof v === "number" ? v : Number(v);
              return active === "cost"
                ? ["₩" + num.toLocaleString("ko-KR"), metric.label]
                : [num.toLocaleString("ko-KR"), metric.label];
            }}
          />
          <Line
            type="monotone"
            dataKey={active}
            stroke={metric.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
