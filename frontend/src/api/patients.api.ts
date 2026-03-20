import client from "./client";
import type { Patient } from "../types/patient.types";

export interface RegisterPatientPayload {
  name: string;
  dob: string;
  unit: string;
  dryWeightKg: number;
}

export async function registerPatient(
  payload: RegisterPatientPayload
): Promise<Patient> {
  const { data } = await client.post<Patient>("/patients", payload);
  return data;
}