import { ANOMALY_CONFIG } from "../config/anomaly.config";
import type { IAnomaly } from "../models/session.model";

interface SessionInput {
  preWeightKg: number;
  postBP: { systolic: number; diastolic: number };
  startTime: Date;
  endTime: Date;
}

export function detectAnomalies(
  session: SessionInput,
  dryWeightKg: number
): IAnomaly[] {
  const anomalies: IAnomaly[] = [];

  // 1. Interdialytic weight gain
  const weightGain = session.preWeightKg - dryWeightKg;
  if (weightGain > ANOMALY_CONFIG.maxInterdialyticWeightGainKg) {
    anomalies.push({
      type: "WEIGHT_GAIN",
      value: parseFloat(weightGain.toFixed(1)),
      threshold: ANOMALY_CONFIG.maxInterdialyticWeightGainKg,
      severity: "critical",
    });
  }

  // 2. High post-dialysis systolic BP
  if (session.postBP.systolic > ANOMALY_CONFIG.maxPostSystolicBP) {
    anomalies.push({
      type: "HIGH_POST_BP",
      value: session.postBP.systolic,
      threshold: ANOMALY_CONFIG.maxPostSystolicBP,
      severity: "critical",
    });
  }

  // 3. Abnormal session duration
  const durationMinutes = Math.round(
    (session.endTime.getTime() - session.startTime.getTime()) / 60000
  );

  if (durationMinutes < ANOMALY_CONFIG.sessionShortThresholdMinutes) {
    anomalies.push({
      type: "SHORT_SESSION",
      value: durationMinutes,
      threshold: ANOMALY_CONFIG.sessionShortThresholdMinutes,
      severity: "warning",
    });
  } else if (durationMinutes > ANOMALY_CONFIG.sessionLongThresholdMinutes) {
    anomalies.push({
      type: "LONG_SESSION",
      value: durationMinutes,
      threshold: ANOMALY_CONFIG.sessionLongThresholdMinutes,
      severity: "warning",
    });
  }

  return anomalies;
}