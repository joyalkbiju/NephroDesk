import type { Session } from "./session.types";

export type Unit = "ICU" | "Ward A" | "Ward B" | "HDU";

export type PatientStatus = "not_started" | "in_progress" | "completed";

export interface Patient {
  _id: string;
  name: string;
  dob: string;
  unit: Unit;
  dryWeightKg: number;
  createdAt: string;
}

export interface ScheduleEntry {
  patient: Patient;
  session?: Session;
  status: PatientStatus;
}