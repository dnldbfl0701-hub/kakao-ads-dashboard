"use client";

import { useState } from "react";
import KpiGrid from "@/components/KpiGrid";
import DailyChart from "@/components/DailyChart";
import CreativeTable from "@/components/CreativeTable";
import ConversionFunnel from "@/components/ConversionFunnel";
import type { KpiData, DailyRow, WeeklyRow, CreativeSummary } from "@/lib/types";

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

export default function TabClient({ commonKpi, commonDaily, commonWeekly, commonCreatives, regionalSets }: Props) {
  const [tab, setTab] = useState<"common" | "regional">("common");
  const [region, setRegion] = useState(regionalSets[0]?.region ?? "");

  const activeRegion = regionalSets.find((r) => r.region === region);

  return (
    <div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {(["common", "regional"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "common" ? "공통 타깃" : "지방 타깃"}
          </button>
        ))}
      </div>

      {tab === "common" && (
        <div className="space-y-6">
          <section>
            <h2 className="text-base font-semibold text-gray-700 mb-3">전체 성과</h2>
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

      {tab === "regional" && (
        <div className="space-y-6">
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

          {activeRegion && (
            <div className="space-y-6">
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">
                  {activeRegion.region} 전체 성과
                </h2>
                <KpiGrid kpi={activeRegion.kpi} />
              </section>
              <ConversionFunnel kpi={activeRegion.kpi} />
              <DailyChart data={activeRegion.daily} weeklyData={activeRegion.weekly} />
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">
                  {activeRegion.region} 소재별 성과
                </h2>
                <CreativeTable creatives={activeRegion.creatives} />
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
