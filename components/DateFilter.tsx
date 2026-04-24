"use client";

interface Props {
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  onChange: (start: string, end: string) => void;
}

export default function DateFilter({ startDate, endDate, minDate, maxDate, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-wrap">
      <span className="text-sm font-medium text-gray-600">기간 필터</span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          min={minDate}
          max={endDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400"
        />
        <span className="text-gray-400 text-sm">~</span>
        <input
          type="date"
          value={endDate}
          min={startDate}
          max={maxDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400"
        />
      </div>
      <button
        onClick={() => onChange(minDate, maxDate)}
        className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-2 py-1.5 transition-colors"
      >
        전체 기간
      </button>
      {(startDate !== minDate || endDate !== maxDate) && (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          필터 적용 중
        </span>
      )}
    </div>
  );
}
