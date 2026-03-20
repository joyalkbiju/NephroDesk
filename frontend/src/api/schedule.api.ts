import client from "./client";
import type { ScheduleEntry } from "../types/patient.types";

export async function getTodaySchedule(unit: string): Promise<ScheduleEntry[]> {
  const { data } = await client.get<ScheduleEntry[]>("/schedule/today", {
    params: { unit },
  });
  return data;
}