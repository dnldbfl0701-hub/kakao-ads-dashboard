"use client";

import type { CreativeSummary } from "@/lib/types";
import { formatWon, formatNum, formatPct } from "@/lib/utils";

interface Props {
  creatives: CreativeSummary[];
  showPurchase?: boolean;
}

function getRankBadge(rank: number) {
  if (rank === 1) return <span className="inline-block bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded mr-1.5">1위</span>;
  if (rank === 2) return <span className="inline-block bg-gray-300 text-gray-700 text-xs font-bold px-1.5 py-0.5 rounded mr-1.5">2위</span>;
  if (rank === 3) return <span className="inline-block bg-orange-300 text-white text-xs font-bold px-1.5 py-0.5 rounded mr-1.5">3위</span>;
  return null;
}

export default function CreativeTable({ creatives, showPurchase = false }: Props) {
  // CPA 기준 정렬 (전환 있는 것만, 없는 건 맨 뒤)
  const sortKey = showPurchase ? "purchase" : "firstConv";
  const sorted = [...creatives].sort((a, b) => {
    const aConv = showPurchase ? a.purchase : a.firstConv;
    const bConv = showPurchase ? b.purchase : b.firstConv;
    if (aConv === 0 && bConv === 0) return b.cost - a.cost;
    if (aConv === 0) return 1;
    if (bConv === 0) return -1;
    const aCpa = a.cost / aConv;
    const bCpa = b.cost / bConv;
    return aCpa - bCpa;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className="text-xs text-gray-500">
          {showPurchase ? "구매 CPA 낮은 순" : "잠재고객 CPA 낮은 순"} 정렬
        </span>
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">우수 소재 = CPA 낮을수록</span>
      </div>
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
                  <th className="text-right px-4 py-3 font-semibold text-blue-500 whitespace-nowrap">
                    사전알림신청<br /><span className="text-gray-400 font-normal text-xs">= 장바구니 보기</span>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-blue-500 whitespace-nowrap">
                    1차 PV<br /><span className="text-gray-400 font-normal text-xs">= 장바구니 추가</span>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">
                    1차 지원완료<br /><span className="text-gray-400 font-normal text-xs">= 잠재고객</span>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-yellow-600 whitespace-nowrap">CPA(1차)</th>
                  <th className="text-right px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">
                    2차 지원완료<br /><span className="text-gray-400 font-normal text-xs">= 서비스신청</span>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">CPA(2차)</th>
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
            {sorted.map((c, idx) => {
              const conv = showPurchase ? c.purchase : c.firstConv;
              const rank = conv > 0 ? idx + 1 : null;
              const isTop = rank === 1;
              return (
                <tr key={c.name} className={`transition-colors ${isTop ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-50"}`}>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {rank ? getRankBadge(rank) : null}
                    {c.displayName}
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
