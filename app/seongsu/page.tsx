import adsData from "@/lib/adsData.json";
import { calcKpi, getDailyRows, getWeeklyRows, getCreativeSummaries } from "@/lib/utils";
import type { AdRow } from "@/lib/types";
import KpiGrid from "@/components/KpiGrid";
import DailyChart from "@/components/DailyChart";
import CreativeTable from "@/components/CreativeTable";
import ConversionFunnel from "@/components/ConversionFunnel";

export default function SeongsuPage() {
  const rows = adsData.seongsu as AdRow[];
  const kpi = calcKpi(rows);
  const daily = getDailyRows(rows);
  const weekly = getWeeklyRows(rows);
  const creatives = getCreativeSummaries(rows);

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
