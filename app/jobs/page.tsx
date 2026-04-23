import adsData from "@/lib/adsData.json";
import { calcKpi, getDailyRows, getCreativeSummaries } from "@/lib/utils";
import type { AdRow } from "@/lib/types";
import TabClient from "./TabClient";

const REGIONS = ["광주", "대구", "부산", "대전"] as const;

export default function 취업지원금Page() {
  const commonRows = adsData.common as AdRow[];
  const commonKpi = calcKpi(commonRows);
  const commonDaily = getDailyRows(commonRows);
  const commonCreatives = getCreativeSummaries(commonRows);

  const regionalSets = REGIONS.map((region) => {
    const rows = (adsData.regional as Record<string, AdRow[]>)[region];
    return {
      region,
      kpi: calcKpi(rows),
      daily: getDailyRows(rows),
      creatives: getCreativeSummaries(rows),
    };
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>캠페인</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">취업지원금찾기</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">취업지원금찾기</h1>
        <p className="text-sm text-gray-400 mt-1">2024.04.25 ~ 2024.07.26 · 카카오 비즈보드 배너</p>
      </div>

      <TabClient
        commonKpi={commonKpi}
        commonDaily={commonDaily}
        commonCreatives={commonCreatives}
        regionalSets={regionalSets}
      />
    </div>
  );
}
