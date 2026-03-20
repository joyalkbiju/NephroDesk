import { useState, useEffect, useCallback } from "react";
import type { ScheduleEntry } from "../types/patient.types";


interface UseScheduleResult {
  data: ScheduleEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSchedule(unit: string): UseScheduleResult {
  const [data, setData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const { getTodaySchedule } = await import("../api/schedule.api");
        const result = await getTodaySchedule(unit);
        setData(Array.isArray(result) ? result : []);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load schedule");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}