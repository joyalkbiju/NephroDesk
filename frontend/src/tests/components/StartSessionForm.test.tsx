import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StartSessionForm from "../../components/session/StartSessionForm";
import type { Patient } from "../../types/patient.types";

const mockPatient: Patient = {
  _id: "p1",
  name: "Arun Kumar",
  dob: "1970-01-01",
  unit: "ICU",
  dryWeightKg: 68,
  createdAt: new Date().toISOString(),
};

describe("StartSessionForm", () => {
  it("renders patient name in title", () => {
    render(
      <StartSessionForm
        patient={mockPatient}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(screen.getByText(/Arun Kumar/i)).toBeInTheDocument();
  });

  it("renders dry weight in info banner", () => {
    render(
      <StartSessionForm
        patient={mockPatient}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(screen.getByText(/68 kg/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(
      <StartSessionForm
        patient={mockPatient}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Start session"));
    expect(await screen.findAllByText("Required")).toBeTruthy();
  });

  it("calls onClose when cancel is clicked", () => {
    const onClose = vi.fn();
    render(
      <StartSessionForm
        patient={mockPatient}
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders machine ID and pre-weight inputs", () => {
    render(
      <StartSessionForm
        patient={mockPatient}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText("e.g. HD-04")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("72.5")).toBeInTheDocument();
  });

  it("does not render post-weight or post-BP fields", () => {
    render(
      <StartSessionForm
        patient={mockPatient}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(screen.queryByPlaceholderText("70.0")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("140")).not.toBeInTheDocument();
  });
});