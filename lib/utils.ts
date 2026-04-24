import type { AdRow, KpiData, DailyRow, WeeklyRow, CreativeSummary } from "./types";

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

export function getWeeklyRows(rows: AdRow[]): WeeklyRow[] {
  const byWeek: Record<string, WeeklyRow> = {};
  rows.forEach((r) => {
    const raw = r["일"]; // "2024.04.25"
    const parts = raw.split(".");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const d = new Date(year, month, day);
    // 해당 날짜가 속한 주의 월요일 계산
    const dow = d.getDay(); // 0=일,1=월...6=토
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    const weekKey = `${monday.getFullYear()}.${String(monday.getMonth() + 1).padStart(2, "0")}.${String(monday.getDate()).padStart(2, "0")}`;
    const mm = String(monday.getMonth() + 1).padStart(2, "0");
    const dd = String(monday.getDate()).padStart(2, "0");
    const endDate = new Date(monday);
    endDate.setDate(monday.getDate() + 6);
    const em = String(endDate.getMonth() + 1).padStart(2, "0");
    const ed = String(endDate.getDate()).padStart(2, "0");
    const weekLabel = `${mm}/${dd}~${em}/${ed}`;
    if (!byWeek[weekKey]) {
      byWeek[weekKey] = { week: weekKey, weekLabel, cost: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0 };
    }
    byWeek[weekKey].cost += n(r["비용"]);
    byWeek[weekKey].impressions += n(r["노출수"]);
    byWeek[weekKey].clicks += n(r["클릭수"]);
  });
  return Object.values(byWeek)
    .sort((a, b) => a.week.localeCompare(b.week))
    .map((w, i) => ({
      ...w,
      weekLabel: `${i + 1}주차 (${w.weekLabel})`,
      ctr: w.impressions > 0 ? (w.clicks / w.impressions) * 100 : 0,
      cpc: w.clicks > 0 ? w.cost / w.clicks : 0,
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

export function extractCreativeType(name: string): string | null {
  const m = name.match(/취업지원금_[^_]+_([^_]+)_/);
  return m ? m[1] : null;
}

function formatCreativeName(name: string): string {
  const regionalMatch = name.match(/취업지원금_[^_]+_([^_]+)_/);
  if (regionalMatch) return regionalMatch[1];

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
