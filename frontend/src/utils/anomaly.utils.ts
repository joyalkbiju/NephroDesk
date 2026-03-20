import type { Anomaly, AnomalyType } from "../types/anomaly.types";

const ANOMALY_LABELS: Record<AnomalyType, (a: Anomaly) => string> = {
  WEIGHT_GAIN: (a) => `Weight gain ${a.value.toFixed(1)} kg`,
  HIGH_POST_BP: (a) => `Post BP ${a.value} mmHg`,
  SHORT_SESSION: (a) => `Short session ${a.value} min`,
  LONG_SESSION: (a) => `Long session ${a.value} min`,
};

export function anomalyLabel(anomaly: Anomaly): string {
  return ANOMALY_LABELS[anomaly.type]?.(anomaly) ?? anomaly.type;
}

export function getAnomalySeverityColor(severity: "warning" | "critical"): string {
  return severity === "critical"
    ? "text-red-700 bg-red-50 border-red-200"
    : "text-amber-700 bg-amber-50 border-amber-200";
}