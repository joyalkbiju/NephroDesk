import type { Session } from "../../types/session.types";
import { formatDuration, formatWeight, formatBP } from "../../utils/formatters";

interface SessionDetailsProps {
  session: Session;
}

export default function SessionDetails({ session }: SessionDetailsProps) {
  const duration =
    session.startTime && session.endTime
      ? Math.round(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            60000
        )
      : null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
      <Detail label="Pre weight" value={formatWeight(session.preWeightKg)} />
      <Detail label="Post weight" value={session.postWeightKg ? formatWeight(session.postWeightKg) : "—"} />
      <Detail label="Pre BP" value={formatBP(session.preBP)} />
      <Detail label="Post BP" value={session.postBP ? formatBP(session.postBP) : "—"} />
      <Detail label="Start" value={new Date(session.startTime).toLocaleTimeString()} />
      <Detail label="End" value={session.endTime ? new Date(session.endTime).toLocaleTimeString() : "—"} />
      <Detail label="Duration" value={duration !== null ? formatDuration(duration) : "—"} />
      <Detail label="Machine" value={session.machineId} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2.5">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}