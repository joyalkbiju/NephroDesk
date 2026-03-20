import type { Anomaly } from "./anomaly.types";

export interface BP {
  systolic: number;
  diastolic: number;
}

export type SessionStatus = "in_progress" | "completed";

export interface Session {
  _id: string;
  patientId: string;
  machineId: string;
  status: SessionStatus;
  startTime: string;
  endTime?: string;
  preWeightKg: number;
  postWeightKg?: number;
  preBP: BP;
  postBP?: BP;
  notes?: string;
  anomalies: Anomaly[];
  createdAt: string;
}