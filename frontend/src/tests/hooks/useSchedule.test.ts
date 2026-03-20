import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSchedule } from "../../hooks/useSchedule";
import * as scheduleApi from "../../api/schedule.api";
import type { ScheduleEntry } from "../../types/patient.types";

const mockSchedule: ScheduleEntry[] = [
  {
    patient: {
      _id: "p1",
      name: "Arun Kumar",
      dob: "1970-01-01",
      unit: "ICU",
      dryWeightKg: 68,
      createdAt: new Date().toISOString(),
    },
    status: "not_started",
  },
];

describe("useSchedule", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns data on successful fetch", async () => {
    vi.spyOn(scheduleApi, "getTodaySchedule").mockResolvedValue(mockSchedule);
    const { result } = renderHook(() => useSchedule("ICU"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockSchedule);
    expect(result.current.error).toBeNull();
  });

  it("sets error on failed fetch", async () => {
    vi.spyOn(scheduleApi, "getTodaySchedule").mockRejectedValue(
      new Error("Network error")
    );
    const { result } = renderHook(() => useSchedule("ICU"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.data).toEqual([]);
  });

  it("refetches when refetch is called", async () => {
    const spy = vi
      .spyOn(scheduleApi, "getTodaySchedule")
      .mockResolvedValue(mockSchedule);

    const { result } = renderHook(() => useSchedule("ICU"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.refetch();
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });

  it("refetches when unit changes", async () => {
    const spy = vi
      .spyOn(scheduleApi, "getTodaySchedule")
      .mockResolvedValue(mockSchedule);

    const { rerender } = renderHook(({ unit }) => useSchedule(unit), {
      initialProps: { unit: "ICU" },
    });

    await waitFor(() => expect(spy).toHaveBeenCalledWith("ICU"));

    rerender({ unit: "Ward A" });
    await waitFor(() => expect(spy).toHaveBeenCalledWith("Ward A"));
  });
});