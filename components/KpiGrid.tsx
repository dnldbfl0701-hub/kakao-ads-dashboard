import KpiCard from "./KpiCard";
import type { KpiData } from "@/lib/types";
import { formatWon, formatNum, formatPct } from "@/lib/utils";

interface Props {
  kpi: KpiData;
  showPurchase?: boolean;
}

export default function KpiGrid({ kpi, showPurchase = false }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard label="총 비용" value={formatWon(kpi.totalCost)} />
      <KpiCard label="총 노출수" value={formatNum(kpi.totalImpressions)} />
      <KpiCard label="총 클릭수" value={formatNum(kpi.totalClicks)} />
      <KpiCard label="평균 CTR" value={formatPct(kpi.avgCtr)} />
      <KpiCard label="평균 CPC" value={formatWon(kpi.avgCpc)} />
      {!showPurchase && kpi.firstConv > 0 && (
        <KpiCard
          label="1차 지원완료"
          value={formatNum(kpi.firstConv)}
          sub={`CPA ${formatWon(kpi.firstConvCpa)}`}
          highlight
        />
      )}
      {!showPurchase && kpi.secondConv > 0 && (
        <KpiCard
          label="2차 지원완료"
          value={formatNum(kpi.secondConv)}
          sub={`CPA ${formatWon(kpi.secondConvCpa)}`}
          highlight
        />
      )}
      {!showPurchase && kpi.preRegister > 0 && (
        <KpiCard
          label="사전알림신청"
          value={formatNum(kpi.preRegister)}
          sub={`CPA ${formatWon(kpi.preRegisterCpa)}`}
        />
      )}
      {!showPurchase && kpi.firstPv > 0 && (
        <KpiCard
          label="1차 PV"
          value={formatNum(kpi.firstPv)}
          sub={`CPA ${formatWon(kpi.firstPvCpa)}`}
        />
      )}
      {showPurchase && kpi.purchase > 0 && (
        <KpiCard
          label="전환"
          value={formatNum(kpi.purchase)}
          sub={`CPA ${formatWon(kpi.purchaseCpa)}`}
          highlight
        />
      )}
    </div>
  );
}
