import type { AdRow, KpiData, DailyRow, CreativeSummary } from "./types";

const n = (v: string) => parseFloat(v) || 0;

export function calcKpi(rows: AdRow[]): KpiData {
  const totalCost = rows.reduce((s, r) => s + n(r["비용"]), 0);
  const totalImpressions = rows.reduce((s, r) => s + n(r["노출수"]), 0);
  const totalClicks = rows.reduce((s, r) => s + n(r["클릭수"]), 0);
  const preRegister = rows.reduce((s, r) => s + n(r["장바구니 열람 (7일)"]), 0);
  const firstPv = rows.reduce((s, r) => s + n(r["장바구니추가(7일)"]), 0);
  const firstConv = rows.reduce((s, r) => s + n(r["잠재고객 (7일)"]), 0);
  const secondConv = rows.reduce((s, r) => s + n(r["서비스신청 (7일)"]), 0);
  const purchase = rows.reduce((s, r) => s + n(r["구매 (7일)"]), 0);

  return {
    totalCost,
    totalImpressions,
    totalClicks,
    avgCtr: totalClicks / totalImpressions * 100 || 0,
    avgCpc: totalClicks > 0 ? totalCost / totalClicks : 0,
    preRegister,
    preRegisterCpa: preRegister > 0 ? totalCost / preRegister : 0,
    firstPv,
    firstPvCpa: firstPv > 0 ? totalCost / firstPv : 0,
    firstConv,
    firstConvCpa: firstConv > 0 ? totalCost / firstConv : 0,
    secondConv,
    secondConvCpa: secondConv > 0 ? totalCost / secondConv : 0,
    purchase,
    purchaseCpa: purchase > 0 ? totalCost / purchase : 0,
  };
}

export function getDailyRows(rows: AdRow[]): DailyRow[] {
  const byDate: Record<string, DailyRow> = {};
  rows.forEach((r) => {
    const date = r["일"];
    if (!byDate[date]) {
      byDate[date] = { date, cost: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0 };
    }
    byDate[date].cost += n(r["비용"]);
    byDate[date].impressions += n(r["노출수"]);
    byDate[date].clicks += n(r["클릭수"]);
  });
  return Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      ctr: d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0,
      cpc: d.clicks > 0 ? d.cost / d.clicks : 0,
    }));
}

export function getCreativeSummaries(rows: AdRow[]): CreativeSummary[] {
  const byCreative: Record<string, CreativeSummary> = {};
  rows.forEach((r) => {
    const raw = r["소재 이름"];
    if (!byCreative[raw]) {
      byCreative[raw] = {
        name: raw,
        displayName: formatCreativeName(raw),
        cost: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0,
        preRegister: 0, firstPv: 0, firstConv: 0, secondConv: 0, purchase: 0,
      };
    }
    const c = byCreative[raw];
    c.cost += n(r["비용"]);
    c.impressions += n(r["노출수"]);
    c.clicks += n(r["클릭수"]);
    c.preRegister += n(r["장바구니 열람 (7일)"]);
    c.firstPv += n(r["장바구니추가(7일)"]);
    c.firstConv += n(r["잠재고객 (7일)"]);
    c.secondConv += n(r["서비스신청 (7일)"]);
    c.purchase += n(r["구매 (7일)"]);
  });
  return Object.values(byCreative).map((c) => ({
    ...c,
    ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
    cpc: c.clicks > 0 ? c.cost / c.clicks : 0,
  }));
}

function formatCreativeName(name: string): string {
  // 지역_소재유형 패턴 처리
  const regionalMatch = name.match(/취업지원금_(\w+)_(.+?)_\d+_/);
  if (regionalMatch) return `${regionalMatch[2]}`;

  const map: Record<string, string> = {
    "나만몰랐다고_1029x258": "나만몰랐다고",
    "숨은지원금_1029x258": "숨은지원금",
    "똑똑_1029x258": "똑똑",
  };
  if (map[name]) return map[name];

  // 성수팝업 소재
  if (name.includes("성수팝업")) return "AI철학관 사전예약";

  return name.split("_")[0];
}

export function formatNum(n: number, decimal = 0) {
  return n.toLocaleString("ko-KR", {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
}

export function formatWon(n: number) {
  return "₩" + formatNum(Math.round(n));
}

export function formatPct(n: number) {
  return n.toFixed(3) + "%";
}
