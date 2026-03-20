import type { PatientStatus } from "../../types/patient.types";

interface StatusBadgeProps {
  status: PatientStatus;
}

const STATUS_CONFIG = {
  not_started: {
    label: "Not started",
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  in_progress: {
    label: "In progress",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500 animate-pulse",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
} satisfies Record<PatientStatus, { label: string; classes: string; dot: string }>;

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}