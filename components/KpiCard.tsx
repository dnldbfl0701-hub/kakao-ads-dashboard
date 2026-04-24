"use client";

interface Props {
  label: string;
  originalLabel?: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

export default function KpiCard({ label, originalLabel, value, sub, highlight }: Props) {
  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col gap-1 ${highlight ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}>
      <span className={`text-xs font-medium ${highlight ? "text-yellow-600" : "text-gray-500"}`}>{label}</span>
      {originalLabel && (
        <span className="text-xs text-gray-300">{originalLabel}</span>
      )}
      <span className={`text-xl font-bold ${highlight ? "text-yellow-600" : "text-gray-900"}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}
