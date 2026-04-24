"use client";

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyRow, WeeklyRow } from "@/lib/types";
import { useState } from "react";

interface Props {
  data: DailyRow[];
  weeklyData: WeeklyRow[];
}

const METRICS = [
  { key: "cost", label: "비용 (₩)", color: "#FACC15" },
  { key: "impressions", label: "노출수", color: "#60A5FA" },
  { key: "clicks", label: "클릭수", color: "#34D399" },
] as const;

function formatTick(v: number, metricKey: string) {
  if (metricKey === "cost") return `₩${(v / 1000).toFixed(0)}k`;
  return v.toLocaleString();
}

function formatTooltip(v: number, metricKey: string, label: string) {
  const display = metricKey === "cost" ? "₩" + v.toLocaleString("ko-KR") : v.toLocaleString("ko-KR");
  return [display, label];
}

export default function DailyChart({ data, weeklyData }: Props) {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [active, setActive] = useState<string>("cost");

  const metric = METRICS.find((m) => m.key === active)!;

  const dailyFormatted = data.map((d) => ({
    ...d,
    date: d.date.replace("2024.", "").replace(".", "/"),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("daily")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view === "daily" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            일별
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view === "weekly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            주차별
          </button>
        </div>
        <div className="flex gap-2">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                active === m.key ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={active === m.key ? { backgroundColor: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {view === "daily" && (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dailyFormatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatTick(v, active)} />
            <Tooltip formatter={(v) => formatTooltip(Number(v), active, metric.label)} />
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
      )}

      {view === "weekly" && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyData} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 9 }}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatTick(v, active)} />
            <Tooltip formatter={(v) => formatTooltip(Number(v), active, metric.label)} />
            <Bar dataKey={active} fill={metric.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
