import client from "./client";
import type { Session } from "../types/session.types";

export interface StartSessionPayload {
  patientId: string;
  machineId: string;
  startTime: string;
  preWeightKg: number;
  preBP: { systolic: number; diastolic: number };
}

export interface CompleteSessionPayload {
  postWeightKg: number;
  postBP: { systolic: number; diastolic: number };
  endTime: string;
  notes?: string;
}

export async function startSession(
  payload: StartSessionPayload
): Promise<Session> {
  const { data } = await client.post<Session>("/sessions", payload);
  return data;
}

export async function completeSession(
  sessionId: string,
  payload: CompleteSessionPayload
): Promise<Session> {
  const { data } = await client.patch<Session>(
    `/sessions/${sessionId}/complete`,
    payload
  );
  return data;
}

export async function updateNotes(
  sessionId: string,
  notes: string
): Promise<Session> {
  const { data } = await client.patch<Session>(
    `/sessions/${sessionId}/notes`,
    { notes }
  );
  return data;
}