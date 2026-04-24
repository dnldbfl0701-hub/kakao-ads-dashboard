"use client";

import { useState, useMemo } from "react";
import KpiGrid from "@/components/KpiGrid";
import DailyChart from "@/components/DailyChart";
import CreativeTable from "@/components/CreativeTable";
import ConversionFunnel from "@/components/ConversionFunnel";
import InsightBanner from "@/components/InsightBanner";
import DateFilter from "@/components/DateFilter";
import type { AdRow } from "@/lib/types";
import { calcKpi, getDailyRows, getWeeklyRows, getCreativeSummaries, formatWon, formatPct } from "@/lib/utils";

const MIN_DATE = "2024-11-28";
const MAX_DATE = "2024-12-08";

function filterRows(rows: AdRow[], start: string, end: string): AdRow[] {
  const s = start.replace(/-/g, ".");
  const e = end.replace(/-/g, ".");
  return rows.filter((r) => r["일"] >= s && r["일"] <= e);
}

export default function SeongsuClient({ rows }: { rows: AdRow[] }) {
  const [startDate, setStartDate] = useState(MIN_DATE);
  const [endDate, setEndDate] = useState(MAX_DATE);

  const periodLabel = `${startDate.replace(/-/g, ".")} ~ ${endDate.replace(/-/g, ".")}`;

  const filtered = useMemo(() => filterRows(rows, startDate, endDate), [rows, startDate, endDate]);
  const kpi = useMemo(() => calcKpi(filtered), [filtered]);
  const daily = useMemo(() => getDailyRows(filtered), [filtered]);
  const weekly = useMemo(() => getWeeklyRows(filtered), [filtered]);
  const creatives = useMemo(() => getCreativeSummaries(filtered), [filtered]);

  const bestCreative = useMemo(() => {
    const w = creatives.filter((c) => c.purchase > 0);
    return w.length ? w.sort((a, b) => (a.cost / a.purchase) - (b.cost / b.purchase))[0] : null;
  }, [creatives]);

  const purchaseRate = kpi.totalClicks > 0 ? (kpi.purchase / kpi.totalClicks) * 100 : 0;

  const insights = [
    { emoji: "🏆", label: "최고 효율 소재", value: bestCreative?.displayName ?? "-", sub: bestCreative ? `구매 CPA ${formatWon(bestCreative.cost / bestCreative.purchase)}` : undefined, color: "yellow" as const },
    { emoji: "🔄", label: "클릭 → 구매 전환율", value: `${purchaseRate.toFixed(2)}%`, sub: `클릭 ${kpi.totalClicks.toLocaleString()}건 → 구매 ${kpi.purchase.toLocaleString()}건`, color: "green" as const },
    { emoji: "💰", label: "구매 전환 CPA", value: kpi.purchase > 0 ? formatWon(kpi.purchaseCpa) : "-", sub: kpi.purchase > 0 ? `총 ${kpi.purchase.toLocaleString()}건 전환` : undefined, color: "orange" as const },
    { emoji: "👆", label: "평균 CTR", value: formatPct(kpi.avgCtr), sub: `CPC ${formatWon(kpi.avgCpc)}`, color: "blue" as const },
  ];

  return (
    <div className="space-y-6">
      <DateFilter startDate={startDate} endDate={endDate} minDate={MIN_DATE} maxDate={MAX_DATE} onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
      <InsightBanner insights={insights} />
      <section>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-base font-semibold text-gray-700">전체 성과</h2>
          <span className="text-xs text-gray-400">{periodLabel}</span>
        </div>
        <KpiGrid kpi={kpi} showPurchase />
      </section>
      <ConversionFunnel kpi={kpi} showPurchase />
      <DailyChart data={daily} weeklyData={weekly} />
      <section>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-base font-semibold text-gray-700">소재별 성과</h2>
          <span className="text-xs text-gray-400">{periodLabel}</span>
        </div>
        <CreativeTable creatives={creatives} showPurchase />
      </section>
    </div>
  );
}
