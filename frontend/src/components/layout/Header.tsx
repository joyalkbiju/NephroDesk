import { useState, useEffect } from "react";

type Unit = "ICU" | "Ward A" | "Ward B" | "HDU";

const UNITS: Unit[] = ["ICU", "Ward A", "Ward B", "HDU"];

interface HeaderProps {
  selectedUnit: Unit;
  onUnitChange: (unit: Unit) => void;
  anomalyCount?: number;
}

function getShiftLabel(): { label: string; color: string } {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 15)
    return { label: "Morning shift", color: "text-amber-600" };
  if (hour >= 15 && hour < 23)
    return { label: "Evening shift", color: "text-indigo-500" };
  return { label: "Night shift", color: "text-slate-400" };
}

export default function Header({
  selectedUnit,
  onUnitChange,
  anomalyCount = 0,
}: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const shift = getShiftLabel();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-6">

        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
         <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
  <svg
    className="w-4 h-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13h2l2-6 3 12 3-8 2 4h6"
    />
  </svg>
</div>
<span className="text-slate-900 font-semibold text-lg tracking-tight">
  Nephro<span className="text-cyan-600">Desk</span>
</span>
        </div>

        {/* Unit selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Unit
          </span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {UNITS.map((unit) => (
              <button
                key={unit}
                onClick={() => onUnitChange(unit)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer
                  ${
                    selectedUnit === unit
                      ? "bg-cyan-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Anomaly alert */}
        {anomalyCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-700">
              {anomalyCount} anomal{anomalyCount === 1 ? "y" : "ies"} flagged
            </span>
          </div>
        )}

        {/* Clock + shift */}
        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <div className="text-right">
            <p className="text-sm font-mono font-medium text-slate-800 leading-none">
              {formattedTime}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{formattedDate}</p>
          </div>
          <div
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              shift.label === "Morning shift"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : shift.label === "Evening shift"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
          >
            {shift.label}
          </div>
        </div>
      </div>
    </header>
  );
}