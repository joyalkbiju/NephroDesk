import type { ReactNode } from "react";
import PatientCard from "./PatientCard";
import type { ScheduleEntry } from "../../types/patient.types";

interface PatientListProps {
  schedule: ScheduleEntry[];
  loading: boolean;
  error: string | null;
  showAnomaliesOnly: boolean;
  selectedUnit: string;
  onSessionUpdate: () => void;
  onRegisterClick: () => void;
  filterSlot: ReactNode;
}

export default function PatientList({
  schedule,
  loading,
  error,
  showAnomaliesOnly,
  selectedUnit,
  onSessionUpdate,
  onRegisterClick,
  filterSlot,
}: PatientListProps) {
  return (
    <div>
      {/* Title bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Today's Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            <span className="font-medium text-slate-600">{selectedUnit}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filterSlot}
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Register patient
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading schedule...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              Failed to load schedule
            </p>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
          <button
            onClick={onSessionUpdate}
            className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && schedule.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              {showAnomaliesOnly
                ? "No anomalies detected"
                : "No patients scheduled today"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {showAnomaliesOnly
                ? "All sessions are within normal parameters"
                : `No sessions found for ${selectedUnit}`}
            </p>
          </div>
          {!showAnomaliesOnly && (
            <button
              onClick={onRegisterClick}
              className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
            >
              Register first patient
            </button>
          )}
        </div>
      )}

      {/* Patient cards */}
      {!loading && !error && schedule.length > 0 && (
        <div className="flex flex-col gap-3">
          {schedule.map((entry) => (
            <PatientCard
              key={entry.patient._id}
              entry={entry}
              onSessionUpdate={onSessionUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}