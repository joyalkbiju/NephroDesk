import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PatientCard from "../../components/patient/PatientCard";
import type { ScheduleEntry } from "../../types/patient.types";

const mockPatientBase: ScheduleEntry = {
  patient: {
    _id: "p1",
    name: "Arun Kumar",
    dob: "1970-01-01",
    unit: "ICU",
    dryWeightKg: 68,
    createdAt: new Date().toISOString(),
  },
  status: "not_started",
};

const mockPatientInProgress: ScheduleEntry = {
  patient: {
    _id: "p2",
    name: "Meera Nair",
    dob: "1965-07-22",
    unit: "ICU",
    dryWeightKg: 55,
    createdAt: new Date().toISOString(),
  },
  status: "in_progress",
  session: {
    _id: "s1",
    patientId: "p2",
    machineId: "HD-02",
    status: "in_progress",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    preWeightKg: 58.2,
    preBP: { systolic: 130, diastolic: 80 },
    notes: "",
    anomalies: [],
    createdAt: new Date().toISOString(),
  },
};

const mockPatientCompleted: ScheduleEntry = {
  patient: {
    _id: "p3",
    name: "Lakshmi Pillai",
    dob: "1975-02-18",
    unit: "ICU",
    dryWeightKg: 62,
    createdAt: new Date().toISOString(),
  },
  status: "completed",
  session: {
    _id: "s2",
    patientId: "p3",
    machineId: "HD-03",
    status: "completed",
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    preWeightKg: 63.8,
    postWeightKg: 61.5,
    preBP: { systolic: 138, diastolic: 85 },
    postBP: { systolic: 142, diastolic: 88 },
    notes: "",
    anomalies: [
      { type: "SHORT_SESSION", value: 190, threshold: 210, severity: "warning" },
    ],
    createdAt: new Date().toISOString(),
  },
};

describe("PatientCard", () => {
  it("renders patient name", () => {
    render(<PatientCard entry={mockPatientBase} onSessionUpdate={vi.fn()} />);
    expect(screen.getByText("Arun Kumar")).toBeInTheDocument();
  });

  it("renders dry weight", () => {
    render(<PatientCard entry={mockPatientBase} onSessionUpdate={vi.fn()} />);
    expect(screen.getByText(/68/)).toBeInTheDocument();
  });

  it("shows Start session button when status is not_started", () => {
    render(<PatientCard entry={mockPatientBase} onSessionUpdate={vi.fn()} />);
    expect(screen.getByText("Start session")).toBeInTheDocument();
  });

  it("shows Complete session button when status is in_progress", () => {
    render(<PatientCard entry={mockPatientInProgress} onSessionUpdate={vi.fn()} />);
    expect(screen.getByText("Complete session")).toBeInTheDocument();
  });

  it("does not show any action button when status is completed", () => {
    render(<PatientCard entry={mockPatientCompleted} onSessionUpdate={vi.fn()} />);
    expect(screen.queryByText("Start session")).not.toBeInTheDocument();
    expect(screen.queryByText("Complete session")).not.toBeInTheDocument();
  });

  it("renders anomaly badge when session has anomalies", () => {
    render(<PatientCard entry={mockPatientCompleted} onSessionUpdate={vi.fn()} />);
    expect(screen.getByText(/Short session/i)).toBeInTheDocument();
  });

  it("shows pending for post-weight when in progress", () => {
    render(<PatientCard entry={mockPatientInProgress} onSessionUpdate={vi.fn()} />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("shows notes editor only when completed", () => {
    render(<PatientCard entry={mockPatientCompleted} onSessionUpdate={vi.fn()} />);
    expect(screen.getByPlaceholderText("Add notes...")).toBeInTheDocument();
  });

  it("does not show notes editor when in progress", () => {
    render(<PatientCard entry={mockPatientInProgress} onSessionUpdate={vi.fn()} />);
    expect(screen.queryByPlaceholderText("Add notes...")).not.toBeInTheDocument();
  });
});