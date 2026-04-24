"use client";

import type { CreativeSummary } from "@/lib/types";
import { formatWon, formatNum, formatPct } from "@/lib/utils";

interface Props {
  creatives: CreativeSummary[];
  showPurchase?: boolean;
}

export default function CreativeTable({ creatives, showPurchase = false }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">소재</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">비용</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">노출수</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">클릭수</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">CTR</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">CPC</th>
              {!showPurchase && (
                <>
                  <th className="text-right px-4 py-3 font-semibold text-blue-500 whitespace-nowrap">장바구니 보기</th>
                  <th className="text-right px-4 py-3 font-semibold text-blue-500 whitespace-nowrap">장바구니 추가</th>
                  <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">잠재고객</th>
                  <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">CPA(잠재)</th>
                  <th className="text-right px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">서비스신청</th>
                  <th className="text-right px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">CPA(서비스)</th>
                </>
              )}
              {showPurchase && (
                <>
                  <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">구매 전환</th>
                  <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">CPA</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {creatives.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{c.displayName}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatWon(c.cost)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatNum(c.impressions)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatNum(c.clicks)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatPct(c.ctr)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatWon(c.cpc)}</td>
                {!showPurchase && (
                  <>
                    <td className="px-4 py-3 text-right text-blue-600">
                      {c.preRegister > 0 ? formatNum(c.preRegister) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-600">
                      {c.firstPv > 0 ? formatNum(c.firstPv) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-yellow-700">
                      {c.firstConv > 0 ? formatNum(c.firstConv) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-yellow-700">
                      {c.firstConv > 0 ? formatWon(c.cost / c.firstConv) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-orange-600">
                      {c.secondConv > 0 ? formatNum(c.secondConv) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-600">
                      {c.secondConv > 0 ? formatWon(c.cost / c.secondConv) : "-"}
                    </td>
                  </>
                )}
                {showPurchase && (
                  <>
                    <td className="px-4 py-3 text-right font-semibold text-yellow-700">
                      {c.purchase > 0 ? formatNum(c.purchase) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-yellow-700">
                      {c.purchase > 0 ? formatWon(c.cost / c.purchase) : "-"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
