"use client";

import { useState } from "react";
import KpiGrid from "@/components/KpiGrid";
import DailyChart from "@/components/DailyChart";
import CreativeTable from "@/components/CreativeTable";
import ConversionFunnel from "@/components/ConversionFunnel";
import RegionalComparison from "@/components/RegionalComparison";
import CreativeTypeTable from "@/components/CreativeTypeTable";
import InsightBanner from "@/components/InsightBanner";
import type { KpiData, DailyRow, WeeklyRow, CreativeSummary } from "@/lib/types";
import { formatWon, formatPct } from "@/lib/utils";

interface RegionalSet {
  region: string;
  kpi: KpiData;
  daily: DailyRow[];
  weekly: WeeklyRow[];
  creatives: CreativeSummary[];
}

interface Props {
  commonKpi: KpiData;
  commonDaily: DailyRow[];
  commonWeekly: WeeklyRow[];
  commonCreatives: CreativeSummary[];
  regionalSets: RegionalSet[];
}

function buildCommonInsights(kpi: KpiData, creatives: CreativeSummary[]) {
  const withConv = creatives.filter((c) => c.firstConv > 0);
  const bestCreative = withConv.length
    ? withConv.reduce((b, c) => (c.cost / c.firstConv < b.cost / b.firstConv ? c : b))
    : null;
  const bestCtr = [...creatives].sort((a, b) => b.ctr - a.ctr)[0];
  const funnelRate = kpi.totalClicks > 0 ? (kpi.firstConv / kpi.totalClicks) * 100 : 0;

  return [
    {
      emoji: "🏆",
      label: "최고 효율 소재",
      value: bestCreative?.displayName ?? "-",
      sub: bestCreative ? `잠재고객 CPA ${formatWon(bestCreative.cost / bestCreative.firstConv)}` : undefined,
      color: "yellow" as const,
    },
    {
      emoji: "👆",
      label: "최고 CTR 소재",
      value: bestCtr?.displayName ?? "-",
      sub: bestCtr ? `CTR ${formatPct(bestCtr.ctr)}` : undefined,
      color: "blue" as const,
    },
    {
      emoji: "🔄",
      label: "클릭 → 잠재고객 전환율",
      value: `${funnelRate.toFixed(2)}%`,
      sub: `클릭 ${kpi.totalClicks.toLocaleString()}건 → 잠재고객 ${kpi.firstConv.toLocaleString()}건`,
      color: "green" as const,
    },
    {
      emoji: "💰",
      label: "서비스신청 CPA",
      value: kpi.secondConv > 0 ? formatWon(kpi.secondConvCpa) : "-",
      sub: kpi.secondConv > 0 ? `총 ${kpi.secondConv.toLocaleString()}건` : undefined,
      color: "orange" as const,
    },
  ];
}

function buildRegionalInsights(regionalSets: RegionalSet[]) {
  const withConv = regionalSets.filter((r) => r.kpi.firstConv > 0);
  const best = withConv.length
    ? withConv.reduce((b, r) => (r.kpi.firstConvCpa < b.kpi.firstConvCpa ? r : b))
    : null;
  const worst = withConv.length
    ? withConv.reduce((b, r) => (r.kpi.firstConvCpa > b.kpi.firstConvCpa ? r : b))
    : null;
  const totalConv = regionalSets.reduce((s, r) => s + r.kpi.firstConv, 0);
  const totalCost = regionalSets.reduce((s, r) => s + r.kpi.totalCost, 0);

  return [
    {
      emoji: "🏆",
      label: "최고 효율 지역",
      value: best?.region ?? "-",
      sub: best ? `잠재고객 CPA ${formatWon(best.kpi.firstConvCpa)}` : undefined,
      color: "yellow" as const,
    },
    {
      emoji: "📉",
      label: "최저 효율 지역",
      value: worst && worst.region !== best?.region ? worst.region : "-",
      sub: worst && worst.region !== best?.region ? `잠재고객 CPA ${formatWon(worst.kpi.firstConvCpa)}` : "데이터 없음",
      color: "orange" as const,
    },
    {
      emoji: "🎯",
      label: "지방 타깃 총 잠재고객",
      value: totalConv.toLocaleString() + "건",
      sub: `평균 CPA ${totalConv > 0 ? formatWon(totalCost / totalConv) : "-"}`,
      color: "green" as const,
    },
    {
      emoji: "💸",
      label: "지방 타깃 총 집행 비용",
      value: formatWon(totalCost),
      sub: `4개 지역 합산`,
      color: "blue" as const,
    },
  ];
}

export default function TabClient({ commonKpi, commonDaily, commonWeekly, commonCreatives, regionalSets }: Props) {
  const [tab, setTab] = useState<"common" | "regional">("common");
  const [region, setRegion] = useState<string | null>(null);

  const activeRegion = region ? regionalSets.find((r) => r.region === region) : null;
  const commonInsights = buildCommonInsights(commonKpi, commonCreatives);
  const regionalInsights = buildRegionalInsights(regionalSets);

  return (
    <div>
      {/* 메인 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {(["common", "regional"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setRegion(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "common" ? "공통 타깃" : "지방 타깃"}
          </button>
        ))}
      </div>

      {/* ── 공통 타깃 ── */}
      {tab === "common" && (
        <div className="space-y-6">
          <InsightBanner insights={commonInsights} />
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-base font-semibold text-gray-700">전체 성과</h2>
              <span className="text-xs text-gray-400">2024.04.25 ~ 2024.07.26</span>
            </div>
            <KpiGrid kpi={commonKpi} />
          </section>
          <ConversionFunnel kpi={commonKpi} />
          <DailyChart data={commonDaily} weeklyData={commonWeekly} />
          <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3">소재별 성과</h2>
            <CreativeTable creatives={commonCreatives} />
          </section>
        </div>
      )}

      {/* ── 지방 타깃 ── */}
      {tab === "regional" && !activeRegion && (
        <div className="space-y-6">
          <InsightBanner insights={regionalInsights} />
          <RegionalComparison regions={regionalSets.map((r) => ({ region: r.region, kpi: r.kpi }))} />
          <CreativeTypeTable regionalSets={regionalSets} />
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600 mb-3">지역 상세 보기</p>
            <div className="flex gap-2 flex-wrap">
              {regionalSets.map((r) => (
                <button
                  key={r.region}
                  onClick={() => setRegion(r.region)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                >
                  {r.region} 상세 →
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 지역 상세 ── */}
      {tab === "regional" && activeRegion && (
        <div className="space-y-6">
          <button
            onClick={() => setRegion(null)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← 지방 타깃 전체 보기
          </button>
          <div className="flex gap-2 flex-wrap">
            {regionalSets.map((r) => (
              <button
                key={r.region}
                onClick={() => setRegion(r.region)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  region === r.region
                    ? "bg-yellow-400 border-yellow-400 text-white"
                    : "border-gray-300 text-gray-600 hover:border-yellow-400"
                }`}
              >
                {r.region}
              </button>
            ))}
          </div>
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-base font-semibold text-gray-700">{activeRegion.region} 전체 성과</h2>
              <span className="text-xs text-gray-400">2024.04.25 ~ 2024.07.26</span>
            </div>
            <KpiGrid kpi={activeRegion.kpi} />
          </section>
          <ConversionFunnel kpi={activeRegion.kpi} />
          <DailyChart data={activeRegion.daily} weeklyData={activeRegion.weekly} />
          <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3">{activeRegion.region} 소재별 성과</h2>
            <CreativeTable creatives={activeRegion.creatives} />
          </section>
        </div>
      )}
    </div>
  );
}
