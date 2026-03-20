import client from "./client";
import type { Session } from "../types/session.types";

export interface CreateSessionPayload {
  patientId: string;
  machineId: string;
  preWeightKg: number;
  postWeightKg: number;
  preBP: { systolic: number; diastolic: number };
  postBP: { systolic: number; diastolic: number };
  startTime: string;
  endTime: string;
  notes?: string;
}

export async function createSession(
  payload: CreateSessionPayload
): Promise<Session> {
  const { data } = await client.post<Session>("/sessions", payload);
  return data;
}

export async function updateNotes(
  sessionId: string,
  notes: string
): Promise<Session> {
  const { data } = await client.patch<Session>(`/sessions/${sessionId}/notes`, {
    notes,
  });
  return data;
}