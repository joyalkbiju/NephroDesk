export type AnomalyType =
  | "WEIGHT_GAIN"
  | "HIGH_POST_BP"
  | "SHORT_SESSION"
  | "LONG_SESSION";

export type AnomalySeverity = "warning" | "critical";

export interface Anomaly {
  type: AnomalyType;
  value: number;
  threshold: number;
  severity: AnomalySeverity;
}