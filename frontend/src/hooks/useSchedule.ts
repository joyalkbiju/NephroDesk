import { useState, useEffect, useCallback } from "react";
import { MOCK_SCHEDULE } from "../mocks/MockData";
import type { ScheduleEntry } from "../types/patient.types";

const USE_MOCK = true; // flip to false when backend is ready

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
      if (USE_MOCK) {
        // simulate network delay
        await new Promise((res) => setTimeout(res, 600));
        setData(MOCK_SCHEDULE.filter((e) => e.patient.unit === unit));
      } else {
        const { getTodaySchedule } = await import("../api/schedule.api");
        const result = await getTodaySchedule(unit);
        setData(Array.isArray(result) ? result : []);
      }
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