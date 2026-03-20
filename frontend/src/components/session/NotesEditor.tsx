import { useState, useRef } from "react";
import { updateNotes } from "../../api/sessions.api";

interface NotesEditorProps {
  sessionId: string;
  initialNotes: string;
  onSaved: () => void;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function NotesEditor({
  sessionId,
  initialNotes,
  onSaved,
}: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const lastSaved = useRef(initialNotes);

  async function handleBlur() {
    // don't save if nothing changed
    if (notes.trim() === lastSaved.current.trim()) return;

    setSaveState("saving");
    try {
      await updateNotes(sessionId, notes.trim());
      lastSaved.current = notes.trim();
      setSaveState("saved");
      onSaved();
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-500">
          Nurse notes
        </label>
        <SaveIndicator state={saveState} />
      </div>

      <textarea
        rows={2}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          if (saveState === "error") setSaveState("idle");
        }}
        onBlur={handleBlur}
        placeholder="Add notes..."
        className={`w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border rounded-lg
          outline-none resize-none transition-colors placeholder:text-slate-300
          focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
          ${saveState === "error" ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
      />

      {saveState === "error" && (
        <p className="text-xs text-red-500">Failed to save — try again</p>
      )}
    </div>
  );
}

/* ── Internal helper ── */

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;

  if (state === "saving")
    return (
      <span className="flex items-center gap-1 text-xs text-slate-400">
        <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
        Saving...
      </span>
    );

  if (state === "saved")
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Saved
      </span>
    );

  if (state === "error")
    return (
      <span className="text-xs text-red-500">Save failed</span>
    );

  return null;
}