import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AnomalyBadge from "../../components/anomaly/AnomalyBadge";
import type { Anomaly } from "../../types/anomaly.types";

const weightAnomaly: Anomaly = {
  type: "WEIGHT_GAIN",
  value: 5.2,
  threshold: 4,
  severity: "critical",
};

const bpAnomaly: Anomaly = {
  type: "HIGH_POST_BP",
  value: 168,
  threshold: 160,
  severity: "critical",
};

const shortSession: Anomaly = {
  type: "SHORT_SESSION",
  value: 190,
  threshold: 210,
  severity: "warning",
};

const longSession: Anomaly = {
  type: "LONG_SESSION",
  value: 300,
  threshold: 285,
  severity: "warning",
};

describe("AnomalyBadge", () => {
  it("renders weight gain label with value", () => {
    render(<AnomalyBadge anomaly={weightAnomaly} />);
    expect(screen.getByText(/Weight gain 5.2 kg/i)).toBeInTheDocument();
  });

  it("renders high BP label with value", () => {
    render(<AnomalyBadge anomaly={bpAnomaly} />);
    expect(screen.getByText(/Post BP 168 mmHg/i)).toBeInTheDocument();
  });

  it("renders short session label", () => {
    render(<AnomalyBadge anomaly={shortSession} />);
    expect(screen.getByText(/Short session 190 min/i)).toBeInTheDocument();
  });

  it("renders long session label", () => {
    render(<AnomalyBadge anomaly={longSession} />);
    expect(screen.getByText(/Long session 300 min/i)).toBeInTheDocument();
  });

  it("applies red styling for critical severity", () => {
    const { container } = render(<AnomalyBadge anomaly={weightAnomaly} />);
    expect(container.firstChild).toHaveClass("bg-red-50");
  });

  it("applies amber styling for warning severity", () => {
    const { container } = render(<AnomalyBadge anomaly={shortSession} />);
    expect(container.firstChild).toHaveClass("bg-amber-50");
  });
});
