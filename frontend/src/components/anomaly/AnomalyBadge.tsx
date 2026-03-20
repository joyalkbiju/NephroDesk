import type { Anomaly } from "../../types/anomaly.types";
import { anomalyLabel } from "../../utils/anomaly.utils";

interface AnomalyBadgeProps {
  anomaly: Anomaly;
}

export default function AnomalyBadge({ anomaly }: AnomalyBadgeProps) {
  const isCritical = anomaly.severity === "critical";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isCritical
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      <svg
        className={`w-3 h-3 ${isCritical ? "text-red-500" : "text-amber-500"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      {anomalyLabel(anomaly)}
    </span>
  );
}