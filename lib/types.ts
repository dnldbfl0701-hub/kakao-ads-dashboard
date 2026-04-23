export interface AdRow {
  "소재 이름": string;
  "일": string;
  "비용": string;
  "노출수": string;
  "클릭수": string;
  "클릭률": string;
  "도달수": string;
  "노출당 비용": string;
  "클릭당 비용": string;
  "장바구니 열람 (7일)": string;
  "장바구니 열람당 비용 (7일)": string;
  "장바구니추가(7일)": string;
  "장바구니추가당 비용(7일)": string;
  "잠재고객 (7일)": string;
  "잠재고객당 비용 (7일)": string;
  "서비스신청 (7일)": string;
  "서비스신청당 비용 (7일)": string;
  "구매 (7일)": string;
  "구매당 비용 (7일)": string;
  [key: string]: string;
}

export interface KpiData {
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgCpc: number;
  preRegister: number;     // 사전알림신청 (장바구니 열람)
  preRegisterCpa: number;
  firstPv: number;         // 1차 PV (장바구니추가)
  firstPvCpa: number;
  firstConv: number;       // 1차 지원완료 (잠재고객)
  firstConvCpa: number;
  secondConv: number;      // 2차 지원완료 (서비스신청)
  secondConvCpa: number;
  purchase: number;        // 구매(성수팝업용)
  purchaseCpa: number;
}

export interface DailyRow {
  date: string;
  cost: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

export interface CreativeSummary {
  name: string;
  displayName: string;
  cost: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  preRegister: number;
  firstPv: number;
  firstConv: number;
  secondConv: number;
  purchase: number;
}
