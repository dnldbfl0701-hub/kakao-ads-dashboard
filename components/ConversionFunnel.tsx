"use client";

import type { KpiData } from "@/lib/types";
import { formatNum } from "@/lib/utils";

interface Props {
  kpi: KpiData;
  showPurchase?: boolean;
}

const STEP_COLORS = ["#FACC15", "#60A5FA", "#818CF8", "#34D399", "#F97316", "#EF4444"];

export default function ConversionFunnel({ kpi, showPurchase = false }: Props) {
  const allSteps = showPurchase
    ? [
        { label: "클릭수", value: kpi.totalClicks },
        { label: "구매 전환", value: kpi.purchase },
      ]
    : [
        { label: "클릭수", value: kpi.totalClicks },
        { label: "장바구니 보기", value: kpi.preRegister },
        { label: "장바구니 추가", value: kpi.firstPv },
        { label: "잠재고객", value: kpi.firstConv },
        { label: "서비스신청", value: kpi.secondConv },
      ];

  const steps = allSteps.filter((s) => s.value > 0);
  if (steps.length < 2) return null;

  const maxVal = steps[0].value;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-5">전환 퍼널</h3>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const widthPct = (step.value / maxVal) * 100;
          const prevVal = i > 0 ? steps[i - 1].value : null;
          const rate = prevVal ? ((step.value / prevVal) * 100).toFixed(1) : null;
          const color = STEP_COLORS[i] ?? "#9CA3AF";

          return (
            <div key={step.label}>
              {i > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1 pl-1">
                  <span>↓</span>
                  <span>{rate}% 전환</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{step.label}</span>
                </div>
                <div className="flex-1 h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                    style={{ width: `${widthPct}%`, backgroundColor: color, minWidth: "60px" }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow-sm whitespace-nowrap">
                      {formatNum(step.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
