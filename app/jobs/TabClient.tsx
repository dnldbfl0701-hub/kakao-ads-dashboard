"use client";

import { useState, useMemo } from "react";
import KpiGrid from "@/components/KpiGrid";
import DailyChart from "@/components/DailyChart";
import CreativeTable from "@/components/CreativeTable";
import ConversionFunnel from "@/components/ConversionFunnel";
import RegionalComparison from "@/components/RegionalComparison";
import CreativeTypeTable from "@/components/CreativeTypeTable";
import InsightBanner from "@/components/InsightBanner";
import DateFilter from "@/components/DateFilter";
import type { AdRow } from "@/lib/types";
import { calcKpi, getDailyRows, getWeeklyRows, getCreativeSummaries, formatWon, formatPct } from "@/lib/utils";

const MIN_DATE = "2024-04-25";
const MAX_DATE = "2024-07-26";

const REGIONS = ["광주", "대구", "부산", "대전"] as const;

interface Props {
  commonRows: AdRow[];
  regionalRows: Record<string, AdRow[]>;
}

function dotToHyphen(d: string) { return d.replace(/\./g, "-"); }
function hyphenToDot(d: string) { return d.replace(/-/g, "."); }

function filterRows(rows: AdRow[], start: string, end: string): AdRow[] {
  const s = hyphenToDot(start);
  const e = hyphenToDot(end);
  return rows.filter((r) => r["일"] >= s && r["일"] <= e);
}

function buildInsights(kpi: ReturnType<typeof calcKpi>, creatives: ReturnType<typeof getCreativeSummaries>) {
  const withConv = creatives.filter((c) => c.firstConv > 0);
  const bestCreative = withConv.length
    ? withConv.reduce((b, c) => (c.cost / c.firstConv < b.cost / b.firstConv ? c : b))
    : null;
  const bestCtr = [...creatives].sort((a, b) => b.ctr - a.ctr)[0];
  const funnelRate = kpi.totalClicks > 0 ? (kpi.firstConv / kpi.totalClicks) * 100 : 0;
  return [
    { emoji: "🏆", label: "최고 효율 소재", value: bestCreative?.displayName ?? "-", sub: bestCreative ? `잠재고객 CPA ${formatWon(bestCreative.cost / bestCreative.firstConv)}` : undefined, color: "yellow" as const },
    { emoji: "👆", label: "최고 CTR 소재", value: bestCtr?.displayName ?? "-", sub: bestCtr ? `CTR ${formatPct(bestCtr.ctr)}` : undefined, color: "blue" as const },
    { emoji: "🔄", label: "클릭 → 잠재고객 전환율", value: `${funnelRate.toFixed(2)}%`, sub: `클릭 ${kpi.totalClicks.toLocaleString()}건 → 잠재고객 ${kpi.firstConv.toLocaleString()}건`, color: "green" as const },
    { emoji: "💰", label: "서비스신청 CPA", value: kpi.secondConv > 0 ? formatWon(kpi.secondConvCpa) : "-", sub: kpi.secondConv > 0 ? `총 ${kpi.secondConv.toLocaleString()}건` : undefined, color: "orange" as const },
  ];
}

function buildRegionalInsights(sets: { region: string; kpi: ReturnType<typeof calcKpi> }[]) {
  const withConv = sets.filter((r) => r.kpi.firstConv > 0);
  const best = withConv.length ? withConv.reduce((b, r) => (r.kpi.firstConvCpa < b.kpi.firstConvCpa ? r : b)) : null;
  const worst = withConv.length ? withConv.reduce((b, r) => (r.kpi.firstConvCpa > b.kpi.firstConvCpa ? r : b)) : null;
  const totalConv = sets.reduce((s, r) => s + r.kpi.firstConv, 0);
  const totalCost = sets.reduce((s, r) => s + r.kpi.totalCost, 0);
  return [
    { emoji: "🏆", label: "최고 효율 지역", value: best?.region ?? "-", sub: best ? `잠재고객 CPA ${formatWon(best.kpi.firstConvCpa)}` : undefined, color: "yellow" as const },
    { emoji: "📉", label: "최저 효율 지역", value: worst && worst.region !== best?.region ? worst.region : "-", sub: worst && worst.region !== best?.region ? `잠재고객 CPA ${formatWon(worst.kpi.firstConvCpa)}` : "데이터 없음", color: "orange" as const },
    { emoji: "🎯", label: "지방 타깃 총 잠재고객", value: `${totalConv.toLocaleString()}건`, sub: `평균 CPA ${totalConv > 0 ? formatWon(totalCost / totalConv) : "-"}`, color: "green" as const },
    { emoji: "💸", label: "지방 타깃 총 집행 비용", value: formatWon(totalCost), sub: "4개 지역 합산", color: "blue" as const },
  ];
}

export default function TabClient({ commonRows, regionalRows }: Props) {
  const [tab, setTab] = useState<"common" | "regional">("common");
  const [region, setRegion] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(MIN_DATE);
  const [endDate, setEndDate] = useState(MAX_DATE);

  const periodLabel = `${dotToHyphen(startDate).replace(/-/g, ".")} ~ ${dotToHyphen(endDate).replace(/-/g, ".")}`;

  const filteredCommon = useMemo(() => filterRows(commonRows, startDate, endDate), [commonRows, startDate, endDate]);
  const commonKpi = useMemo(() => calcKpi(filteredCommon), [filteredCommon]);
  const commonDaily = useMemo(() => getDailyRows(filteredCommon), [filteredCommon]);
  const commonWeekly = useMemo(() => getWeeklyRows(filteredCommon), [filteredCommon]);
  const commonCreatives = useMemo(() => getCreativeSummaries(filteredCommon), [filteredCommon]);

  const regionalSets = useMemo(() =>
    REGIONS.map((r) => {
      const rows = filterRows(regionalRows[r] ?? [], startDate, endDate);
      return { region: r, kpi: calcKpi(rows), daily: getDailyRows(rows), weekly: getWeeklyRows(rows), creatives: getCreativeSummaries(rows) };
    }),
    [regionalRows, startDate, endDate]
  );

  const activeRegion = region ? regionalSets.find((r) => r.region === region) : null;
  const commonInsights = useMemo(() => buildInsights(commonKpi, commonCreatives), [commonKpi, commonCreatives]);
  const regionalInsights = useMemo(() => buildRegionalInsights(regionalSets), [regionalSets]);

  const handleDateChange = (start: string, end: string) => { setStartDate(start); setEndDate(end); };

  return (
    <div>
      {/* 메인 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {(["common", "regional"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setRegion(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "common" ? "공통 타깃" : "지방 타깃"}
          </button>
        ))}
      </div>

      <DateFilter startDate={startDate} endDate={endDate} minDate={MIN_DATE} maxDate={MAX_DATE} onChange={handleDateChange} />

      <div className="mt-6 space-y-6">

        {/* ── 공통 타깃 ── */}
        {tab === "common" && (
          <>
            <InsightBanner insights={commonInsights} />
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-base font-semibold text-gray-700">전체 성과</h2>
                <span className="text-xs text-gray-400">{periodLabel}</span>
              </div>
              <KpiGrid kpi={commonKpi} />
            </section>
            <ConversionFunnel kpi={commonKpi} />
            <DailyChart data={commonDaily} weeklyData={commonWeekly} />
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-base font-semibold text-gray-700">소재별 성과</h2>
                <span className="text-xs text-gray-400">{periodLabel}</span>
              </div>
              <CreativeTable creatives={commonCreatives} />
            </section>
          </>
        )}

        {/* ── 지방 타깃 전체 ── */}
        {tab === "regional" && !activeRegion && (
          <>
            <InsightBanner insights={regionalInsights} />
            <RegionalComparison regions={regionalSets.map((r) => ({ region: r.region, kpi: r.kpi }))} />
            <CreativeTypeTable regionalSets={regionalSets} />
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-600 mb-3">지역 상세 보기</p>
              <div className="flex gap-2 flex-wrap">
                {REGIONS.map((r) => (
                  <button key={r} onClick={() => setRegion(r)}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-all">
                    {r} 상세 →
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── 지역 상세 ── */}
        {tab === "regional" && activeRegion && (
          <>
            <button onClick={() => setRegion(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← 지방 타깃 전체 보기
            </button>
            <div className="flex gap-2 flex-wrap">
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${region === r ? "bg-yellow-400 border-yellow-400 text-white" : "border-gray-300 text-gray-600 hover:border-yellow-400"}`}>
                  {r}
                </button>
              ))}
            </div>
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-base font-semibold text-gray-700">{activeRegion.region} 전체 성과</h2>
                <span className="text-xs text-gray-400">{periodLabel}</span>
              </div>
              <KpiGrid kpi={activeRegion.kpi} />
            </section>
            <ConversionFunnel kpi={activeRegion.kpi} />
            <DailyChart data={activeRegion.daily} weeklyData={activeRegion.weekly} />
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-base font-semibold text-gray-700">{activeRegion.region} 소재별 성과</h2>
                <span className="text-xs text-gray-400">{periodLabel}</span>
              </div>
              <CreativeTable creatives={activeRegion.creatives} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
