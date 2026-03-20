import { useState } from "react";
import StatusBadge from "./StatusBadge";
import AnomalyList from "../anomaly/AnomalyList";
import SessionForm from "../session/SessionForm";
import NotesEditor from "../session/NotesEditor";
import type { ScheduleEntry } from "../../types/patient.types";

interface PatientCardProps {
  entry: ScheduleEntry;
  onSessionUpdate: () => void;
}

export default function PatientCard({ entry, onSessionUpdate }: PatientCardProps) {
  const [showForm, setShowForm] = useState(false);
  const { patient, session, status } = entry;

  const hasAnomalies = (session?.anomalies?.length ?? 0) > 0;

  const duration =
    session?.startTime && session?.endTime
      ? Math.round(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            60000
        )
      : null;

  return (
    <>
      <div
        className={`bg-white rounded-xl border transition-colors ${
          hasAnomalies
            ? "border-red-200 shadow-sm shadow-red-50"
            : "border-slate-200"
        }`}
      >
        {/* Anomaly accent strip */}
        {hasAnomalies && (
          <div className="h-1 w-full bg-red-400 rounded-t-xl" />
        )}

        <div className="p-5">
          {/* Top row: patient info + status + action */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-cyan-700">
                  {patient.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>

              {/* Name + meta */}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {patient.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dry weight:{" "}
                  <span className="text-slate-600 font-medium">
                    {patient.dryWeightKg} kg
                  </span>
                  {" · "}
                  Machine:{" "}
                  <span className="text-slate-600 font-medium">
                    {session?.machineId ?? "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={status} />
              {status === "not_started" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
                >
                  Start session
                </button>
              )}
            </div>
          </div>

          {/* Session details — only if session exists */}
          {session && (
            <div className="mt-4">
              {/* Vitals grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <VitalBox
                  label="Pre weight"
                  value={`${session.preWeightKg} kg`}
                />
                <VitalBox
                  label="Post weight"
                  value={`${session.postWeightKg} kg`}
                  sub={
                    session.preWeightKg && session.postWeightKg
                      ? `−${(session.preWeightKg - session.postWeightKg).toFixed(1)} kg removed`
                      : undefined
                  }
                />
                <VitalBox
                  label="Post BP"
                  value={`${session.postBP.systolic}/${session.postBP.diastolic}`}
                  highlight={session.postBP.systolic > 160}
                />
                <VitalBox
                  label="Duration"
                  value={duration !== null ? `${duration} min` : "—"}
                  highlight={
                    duration !== null &&
                    (duration < 210 || duration > 285)
                  }
                />
              </div>

              {/* Anomalies */}
              {hasAnomalies && (
                <div className="mt-3">
                  <AnomalyList anomalies={session.anomalies} />
                </div>
              )}

              {/* Notes */}
              <div className="mt-3">
                <NotesEditor
                  sessionId={session._id}
                  initialNotes={session.notes ?? ""}
                  onSaved={onSessionUpdate}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session form modal */}
      {showForm && (
        <SessionForm
          patient={patient}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            onSessionUpdate();
          }}
        />
      )}
    </>
  );
}

/* ── Small internal component ── */
interface VitalBoxProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

function VitalBox({ label, value, sub, highlight = false }: VitalBoxProps) {
  return (
    <div
      className={`rounded-lg px-3 py-2.5 ${
        highlight ? "bg-red-50 border border-red-200" : "bg-slate-50"
      }`}
    >
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p
        className={`text-sm font-semibold ${
          highlight ? "text-red-700" : "text-slate-800"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}