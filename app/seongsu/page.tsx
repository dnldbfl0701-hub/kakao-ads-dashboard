import adsData from "@/lib/adsData.json";
import type { AdRow } from "@/lib/types";
import SeongsuClient from "./SeongsuClient";

export default function SeongsuPage() {
  const rows = adsData.seongsu as AdRow[];

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
      <SeongsuClient rows={rows} />
    </div>
  );
}
