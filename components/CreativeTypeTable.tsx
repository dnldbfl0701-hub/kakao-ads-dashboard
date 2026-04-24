"use client";

import type { CreativeSummary } from "@/lib/types";
import { formatWon, formatNum, formatPct } from "@/lib/utils";
import { extractCreativeType } from "@/lib/utils";

interface RegionalSet {
  region: string;
  creatives: CreativeSummary[];
}

interface Props {
  regionalSets: RegionalSet[];
}

interface TypeRow {
  type: string;
  byRegion: Record<string, { cost: number; clicks: number; firstConv: number; cpa: number; ctr: number }>;
}

export default function CreativeTypeTable({ regionalSets }: Props) {
  const regions = regionalSets.map((r) => r.region);

  // 소재 유형별로 집계
  const typeMap: Record<string, TypeRow["byRegion"]> = {};
  regionalSets.forEach(({ region, creatives }) => {
    creatives.forEach((c) => {
      const type = extractCreativeType(c.name) ?? c.displayName;
      if (!typeMap[type]) typeMap[type] = {};
      typeMap[type][region] = {
        cost: c.cost,
        clicks: c.clicks,
        firstConv: c.firstConv,
        cpa: c.firstConv > 0 ? c.cost / c.firstConv : 0,
        ctr: c.ctr,
      };
    });
  });

  const rows: TypeRow[] = Object.entries(typeMap).map(([type, byRegion]) => ({ type, byRegion }));

  // 각 지역에서 가장 낮은 CPA 유형 표시용
  const bestTypeByRegion: Record<string, string> = {};
  regions.forEach((region) => {
    const withConv = rows.filter((r) => (r.byRegion[region]?.firstConv ?? 0) > 0);
    if (withConv.length) {
      bestTypeByRegion[region] = withConv.reduce((best, r) =>
        r.byRegion[region].cpa < best.byRegion[region].cpa ? r : best
      ).type;
    }
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-800">소재 유형별 성과 비교</h3>
        <p className="text-xs text-gray-400 mt-0.5">각 지역에서 잠재고객 CPA가 가장 낮은 소재 유형 강조</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">소재 유형</th>
              {regions.map((region) => (
                <th key={region} colSpan={3} className="text-center px-4 py-3 font-semibold text-gray-600 border-l border-gray-200">
                  {region}
                </th>
              ))}
            </tr>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2" />
              {regions.map((region) => (
                <>
                  <th key={`${region}-ctr`} className="text-right px-3 py-2 text-xs font-medium text-gray-500 border-l border-gray-100 whitespace-nowrap">CTR</th>
                  <th key={`${region}-conv`} className="text-right px-3 py-2 text-xs font-medium text-yellow-600 whitespace-nowrap">잠재고객</th>
                  <th key={`${region}-cpa`} className="text-right px-3 py-2 text-xs font-medium text-yellow-600 whitespace-nowrap">CPA</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.type} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{row.type}</td>
                {regions.map((region) => {
                  const d = row.byRegion[region];
                  const isBest = bestTypeByRegion[region] === row.type && (d?.firstConv ?? 0) > 0;
                  return (
                    <>
                      <td key={`${region}-ctr`} className={`px-3 py-3 text-right text-gray-600 border-l border-gray-100 ${isBest ? "bg-yellow-50" : ""}`}>
                        {d ? formatPct(d.ctr) : "-"}
                      </td>
                      <td key={`${region}-conv`} className={`px-3 py-3 text-right font-semibold text-yellow-700 ${isBest ? "bg-yellow-50" : ""}`}>
                        {d?.firstConv ? formatNum(d.firstConv) : "-"}
                      </td>
                      <td key={`${region}-cpa`} className={`px-3 py-3 text-right text-yellow-700 ${isBest ? "bg-yellow-50 font-bold" : ""}`}>
                        {d?.firstConv ? formatWon(d.cpa) : "-"}
                      </td>
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
