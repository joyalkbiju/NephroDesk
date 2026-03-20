interface AnomalyFilterProps {
  enabled: boolean;
  onToggle: () => void;
  anomalyCount: number;
}

export default function AnomalyFilter({
  enabled,
  onToggle,
  anomalyCount,
}: AnomalyFilterProps) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
        enabled
          ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
      }`}
    >
      <svg
        className={`w-4 h-4 ${enabled ? "text-red-500" : "text-slate-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
        />
      </svg>
      {enabled ? "Showing anomalies only" : "Filter anomalies"}
      {anomalyCount > 0 && (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
            enabled ? "bg-red-200 text-red-800" : "bg-red-100 text-red-700"
          }`}
        >
          {anomalyCount}
        </span>
      )}
    </button>
  );
}