interface Insight {
  emoji: string;
  label: string;
  value: string;
  sub?: string;
  color: "yellow" | "blue" | "green" | "orange";
}

interface Props {
  insights: Insight[];
}

const colorMap = {
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", label: "text-yellow-600", value: "text-yellow-800" },
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   label: "text-blue-600",   value: "text-blue-800"   },
  green:  { bg: "bg-green-50",  border: "border-green-200",  label: "text-green-600",  value: "text-green-800"  },
  orange: { bg: "bg-orange-50", border: "border-orange-200", label: "text-orange-600", value: "text-orange-800" },
};

export default function InsightBanner({ insights }: Props) {
  if (!insights.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {insights.map((ins, i) => {
        const c = colorMap[ins.color];
        return (
          <div key={i} className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span>{ins.emoji}</span>
              <span className={`text-xs font-semibold ${c.label}`}>{ins.label}</span>
            </div>
            <p className={`text-base font-bold ${c.value}`}>{ins.value}</p>
            {ins.sub && <p className={`text-xs mt-0.5 ${c.label}`}>{ins.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}
