import { detectAnomalies } from "../services/anomaly.service";
import { ANOMALY_CONFIG } from "../config/anomaly.config";

const baseSession = {
  preWeightKg: 70,
  postBP: { systolic: 140, diastolic: 85 },
  startTime: new Date("2024-01-01T08:00:00"),
  endTime: new Date("2024-01-01T12:00:00"), // 240 min — normal
};

const dryWeight = 68;

describe("detectAnomalies", () => {
  it("returns empty array when all values are normal", () => {
    const result = detectAnomalies(baseSession, dryWeight);
    expect(result).toHaveLength(0);
  });

  it("flags WEIGHT_GAIN when preWeight exceeds dryWeight by more than threshold", () => {
    const session = { ...baseSession, preWeightKg: 73 }; // gain = 5kg
    const result = detectAnomalies(session, dryWeight);
    expect(result).toContainEqual(
      expect.objectContaining({
        type: "WEIGHT_GAIN",
        value: 5,
        threshold: ANOMALY_CONFIG.maxInterdialyticWeightGainKg,
        severity: "critical",
      })
    );
  });

  it("does not flag WEIGHT_GAIN when gain is exactly at threshold", () => {
    const session = { ...baseSession, preWeightKg: 72 }; // gain = 4kg exactly
    const result = detectAnomalies(session, dryWeight);
    expect(result.find((a) => a.type === "WEIGHT_GAIN")).toBeUndefined();
  });

  it("flags HIGH_POST_BP when post systolic exceeds threshold", () => {
    const session = {
      ...baseSession,
      postBP: { systolic: 165, diastolic: 95 },
    };
    const result = detectAnomalies(session, dryWeight);
    expect(result).toContainEqual(
      expect.objectContaining({
        type: "HIGH_POST_BP",
        value: 165,
        threshold: ANOMALY_CONFIG.maxPostSystolicBP,
        severity: "critical",
      })
    );
  });

  it("does not flag HIGH_POST_BP when systolic is exactly at threshold", () => {
    const session = {
      ...baseSession,
      postBP: { systolic: 160, diastolic: 90 },
    };
    const result = detectAnomalies(session, dryWeight);
    expect(result.find((a) => a.type === "HIGH_POST_BP")).toBeUndefined();
  });

  it("flags SHORT_SESSION when duration is below short threshold", () => {
    const session = {
      ...baseSession,
      endTime: new Date("2024-01-01T11:00:00"), // 180 min
    };
    const result = detectAnomalies(session, dryWeight);
    expect(result).toContainEqual(
      expect.objectContaining({
        type: "SHORT_SESSION",
        severity: "warning",
      })
    );
  });

  it("flags LONG_SESSION when duration exceeds long threshold", () => {
    const session = {
      ...baseSession,
      endTime: new Date("2024-01-01T13:00:00"), // 300 min
    };
    const result = detectAnomalies(session, dryWeight);
    expect(result).toContainEqual(
      expect.objectContaining({
        type: "LONG_SESSION",
        severity: "warning",
      })
    );
  });

  it("can flag multiple anomalies at once", () => {
    const session = {
      preWeightKg: 75,
      postBP: { systolic: 170, diastolic: 100 },
      startTime: new Date("2024-01-01T08:00:00"),
      endTime: new Date("2024-01-01T11:00:00"), // short session too
    };
    const result = detectAnomalies(session, dryWeight);
    expect(result.length).toBe(3);
  });
});