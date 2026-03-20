import AnomalyBadge from "./AnomalyBadge";
import type { Anomaly } from "../../types/anomaly.types";

interface AnomalyListProps {
  anomalies: Anomaly[];
}

export default function AnomalyList({ anomalies }: AnomalyListProps) {
  if (!anomalies.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {anomalies.map((anomaly, i) => (
        <AnomalyBadge key={i} anomaly={anomaly} />
      ))}
    </div>
  );
}