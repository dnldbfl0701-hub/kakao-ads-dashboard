import adsData from "@/lib/adsData.json";
import type { AdRow } from "@/lib/types";
import TabClient from "./TabClient";

export default function 취업지원금Page() {
  const commonRows = adsData.common as AdRow[];
  const regionalRows = adsData.regional as Record<string, AdRow[]>;

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
      <TabClient commonRows={commonRows} regionalRows={regionalRows} />
    </div>
  );
}
