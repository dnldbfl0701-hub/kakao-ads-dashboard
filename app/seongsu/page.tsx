import adsData from "@/lib/adsData.json";
import { calcKpi, getDailyRows, getWeeklyRows, getCreativeSummaries, formatWon, formatPct } from "@/lib/utils";
import type { AdRow } from "@/lib/types";
import KpiGrid from "@/components/KpiGrid";
import DailyChart from "@/components/DailyChart";
import CreativeTable from "@/components/CreativeTable";
import ConversionFunnel from "@/components/ConversionFunnel";
import InsightBanner from "@/components/InsightBanner";

export default function SeongsuPage() {
  const rows = adsData.seongsu as AdRow[];
  const kpi = calcKpi(rows);
  const daily = getDailyRows(rows);
  const weekly = getWeeklyRows(rows);
  const creatives = getCreativeSummaries(rows);

  const bestCreative = creatives.filter((c) => c.purchase > 0).sort((a, b) => (a.cost / a.purchase) - (b.cost / b.purchase))[0];
  const purchaseRate = kpi.totalClicks > 0 ? (kpi.purchase / kpi.totalClicks) * 100 : 0;

  const insights = [
    {
      emoji: "🏆",
      label: "최고 효율 소재",
      value: bestCreative?.displayName ?? "-",
      sub: bestCreative ? `구매 CPA ${formatWon(bestCreative.cost / bestCreative.purchase)}` : undefined,
      color: "yellow" as const,
    },
    {
      emoji: "🔄",
      label: "클릭 → 구매 전환율",
      value: `${purchaseRate.toFixed(2)}%`,
      sub: `클릭 ${kpi.totalClicks.toLocaleString()}건 → 구매 ${kpi.purchase.toLocaleString()}건`,
      color: "green" as const,
    },
    {
      emoji: "💰",
      label: "구매 전환 CPA",
      value: kpi.purchase > 0 ? formatWon(kpi.purchaseCpa) : "-",
      sub: kpi.purchase > 0 ? `총 ${kpi.purchase.toLocaleString()}건 전환` : undefined,
      color: "orange" as const,
    },
    {
      emoji: "👆",
      label: "평균 CTR",
      value: formatPct(kpi.avgCtr),
      sub: `CPC ${formatWon(kpi.avgCpc)}`,
      color: "blue" as const,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>캠페인</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">성수 팝업</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">12월 성수 팝업</h1>
        <p className="text-sm text-gray-400 mt-1">2024.11.28 ~ 2024.12.08 · 카카오 비즈보드 배너</p>
      </div>

      <div className="space-y-6">
        <InsightBanner insights={insights} />
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">전체 성과</h2>
          <KpiGrid kpi={kpi} showPurchase />
        </section>
        <ConversionFunnel kpi={kpi} showPurchase />
        <DailyChart data={daily} weeklyData={weekly} />
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">소재별 성과</h2>
          <CreativeTable creatives={creatives} showPurchase />
        </section>
      </div>
    </div>
  );
}
