export const ANOMALY_CONFIG = {
  // Interdialytic weight gain threshold in kg
  // Justification: KDOQI guidelines recommend limiting IDWG to <4 kg
  // Values above this significantly increase cardiovascular risk
  maxInterdialyticWeightGainKg: 4.0,

  // Post-dialysis systolic BP threshold in mmHg
  // Justification: JNC 8 / KDIGO classify systolic >160 as Stage 2 hypertension
  // Post-dialysis hypertension is associated with poor long-term outcomes
  maxPostSystolicBP: 160,

  // Target session duration in minutes (standard HD session = 4 hours)
  sessionTargetMinutes: 240,

  // Sessions shorter than target - tolerance = flagged as SHORT_SESSION
  // Justification: <3.5h (210 min) indicates inadequate solute clearance (Kt/V < target)
  sessionShortThresholdMinutes: 210,

  // Sessions longer than target + tolerance = flagged as LONG_SESSION
  // Justification: >4.75h (285 min) may indicate machine issues or access problems
  sessionLongThresholdMinutes: 285,
} as const;