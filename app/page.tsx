import Link from "next/link";
import adsData from "@/lib/adsData.json";
import { calcKpi } from "@/lib/utils";
import { formatWon, formatNum } from "@/lib/utils";
import type { AdRow } from "@/lib/types";

export default function Home() {
  const commonKpi = calcKpi(adsData.common as AdRow[]);
  const regionalAll = [
    ...adsData.regional["광주"],
    ...adsData.regional["대구"],
    ...adsData.regional["부산"],
    ...adsData.regional["대전"],
  ] as AdRow[];
  const regionalKpi = calcKpi(regionalAll);
  const seongsuKpi = calcKpi(adsData.seongsu as AdRow[]);

  const campaigns = [
    {
      href: "/jobs",
      title: "취업지원금찾기",
      period: "2024.04.25 ~ 2024.07.26",
      badge: "공통 + 지방 타깃",
      cost: commonKpi.totalCost + regionalKpi.totalCost,
      impressions: commonKpi.totalImpressions + regionalKpi.totalImpressions,
      clicks: commonKpi.totalClicks + regionalKpi.totalClicks,
      conv1: commonKpi.firstConv + regionalKpi.firstConv,
      conv2: commonKpi.secondConv + regionalKpi.secondConv,
      color: "yellow",
    },
    {
      href: "/seongsu",
      title: "12월 성수 팝업",
      period: "2024.11.28 ~ 2024.12.08",
      badge: "성수 팝업",
      cost: seongsuKpi.totalCost,
      impressions: seongsuKpi.totalImpressions,
      clicks: seongsuKpi.totalClicks,
      conv1: seongsuKpi.purchase,
      conv2: 0,
      color: "blue",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 개요</h1>
        <p className="text-gray-500 mt-1 text-sm">카카오 비즈보드 광고 성과 대시보드</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-yellow-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  {c.badge}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 group-hover:text-yellow-600 transition-colors">
                  {c.title}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">{c.period}</p>
              </div>
              <span className="text-2xl">→</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">총 비용</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{formatWon(c.cost)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">총 노출수</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{formatNum(c.impressions)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">총 클릭수</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{formatNum(c.clicks)}</p>
              </div>
              {c.conv1 > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-yellow-600">1차 지원완료</p>
                  <p className="font-bold text-yellow-700 text-sm mt-0.5">{formatNum(c.conv1)}</p>
                </div>
              )}
              {c.conv2 > 0 && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-600">2차 지원완료</p>
                  <p className="font-bold text-orange-700 text-sm mt-0.5">{formatNum(c.conv2)}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
