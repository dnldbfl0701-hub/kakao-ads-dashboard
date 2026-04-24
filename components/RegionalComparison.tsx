"use client";

import type { KpiData } from "@/lib/types";
import { formatWon, formatNum, formatPct } from "@/lib/utils";

interface RegionalRow {
  region: string;
  kpi: KpiData;
}

interface Props {
  regions: RegionalRow[];
}

export default function RegionalComparison({ regions }: Props) {
  const withConv = regions.filter((r) => r.kpi.firstConv > 0);
  const bestRegion = withConv.length
    ? withConv.reduce((best, r) => (r.kpi.firstConvCpa < best.kpi.firstConvCpa ? r : best))
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-800">지역별 성과 비교</h3>
        <p className="text-xs text-gray-400 mt-0.5">잠재고객 CPA 기준 최고 효율 지역 강조</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">지역</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">비용</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">노출수</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">클릭수</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">CTR</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">CPC</th>
              <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">잠재고객</th>
              <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">CPA(잠재)</th>
              <th className="text-right px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">서비스신청</th>
              <th className="text-right px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">CPA(서비스)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {regions.map(({ region, kpi }) => {
              const isBest = bestRegion?.region === region;
              return (
                <tr key={region} className={isBest ? "bg-yellow-50" : "hover:bg-gray-50 transition-colors"}>
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    {isBest && (
                      <span className="inline-block bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded mr-1.5">
                        최고효율
                      </span>
                    )}
                    {region}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatWon(kpi.totalCost)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatNum(kpi.totalImpressions)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatNum(kpi.totalClicks)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatPct(kpi.avgCtr)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatWon(kpi.avgCpc)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-yellow-700">
                    {kpi.firstConv > 0 ? formatNum(kpi.firstConv) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-700">
                    {kpi.firstConv > 0 ? formatWon(kpi.firstConvCpa) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-orange-600">
                    {kpi.secondConv > 0 ? formatNum(kpi.secondConv) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-orange-600">
                    {kpi.secondConv > 0 ? formatWon(kpi.secondConvCpa) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
