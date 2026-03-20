import { useState } from "react";
import Modal from "../ui/Modal";
import { completeSession } from "../../api/sessions.api";
import type { Patient } from "../../types/patient.types";
import type { Session } from "../../types/session.types";

interface CompleteSessionFormProps {
  patient: Patient;
  session: Session;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  postWeightKg: string;
  postSystolic: string;
  postDiastolic: string;
  endTime: string;
  notes: string;
}

export default function CompleteSessionForm({
  patient,
  session,
  onClose,
  onSuccess,
}: CompleteSessionFormProps) {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [form, setForm] = useState<FormState>({
    postWeightKg: "",
    postSystolic: "",
    postDiastolic: "",
    endTime: localNow,
    notes: session.notes ?? "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.postWeightKg || isNaN(Number(form.postWeightKg)))
      e.postWeightKg = "Enter a valid weight";
    if (!form.postSystolic || isNaN(Number(form.postSystolic)))
      e.postSystolic = "Required";
    if (!form.postDiastolic || isNaN(Number(form.postDiastolic)))
      e.postDiastolic = "Required";
    if (!form.endTime) e.endTime = "Required";
    if (form.endTime && new Date(form.endTime) <= new Date(session.startTime))
      e.endTime = "Must be after start time";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await completeSession(session._id, {
        postWeightKg: Number(form.postWeightKg),
        postBP: {
          systolic: Number(form.postSystolic),
          diastolic: Number(form.postDiastolic),
        },
        endTime: new Date(form.endTime).toISOString(),
        notes: form.notes.trim(),
      });
      onSuccess();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to complete session");
    } finally {
      setSubmitting(false);
    }
  }

  const startedAt = new Date(session.startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Modal onClose={onClose} title={`Complete session — ${patient.name}`}>
      <div className="flex flex-col gap-5">

        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-slate-400">Started at</p>
            <p className="font-medium text-slate-700">{startedAt}</p>
          </div>
          <div>
            <p className="text-slate-400">Machine</p>
            <p className="font-medium text-slate-700">{session.machineId}</p>
          </div>
          <div>
            <p className="text-slate-400">Pre-weight</p>
            <p className="font-medium text-slate-700">{session.preWeightKg} kg</p>
          </div>
        </div>

        <Field label="Post-weight (kg)" error={errors.postWeightKg}>
          <input
            type="number"
            step="0.1"
            placeholder="70.0"
            value={form.postWeightKg}
            onChange={(e) => set("postWeightKg", e.target.value)}
            className={inputClass(!!errors.postWeightKg)}
          />
        </Field>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">
            Post-dialysis BP (mmHg)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Systolic" error={errors.postSystolic}>
              <input
                type="number"
                placeholder="140"
                value={form.postSystolic}
                onChange={(e) => set("postSystolic", e.target.value)}
                className={inputClass(!!errors.postSystolic)}
              />
            </Field>
            <Field label="Diastolic" error={errors.postDiastolic}>
              <input
                type="number"
                placeholder="85"
                value={form.postDiastolic}
                onChange={(e) => set("postDiastolic", e.target.value)}
                className={inputClass(!!errors.postDiastolic)}
              />
            </Field>
          </div>
        </div>

        <Field label="End time" error={errors.endTime}>
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => set("endTime", e.target.value)}
            className={inputClass(!!errors.endTime)}
          />
        </Field>

        <Field label="Nurse notes (optional)">
          <textarea
            rows={3}
            placeholder="Any observations during the session..."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`${inputClass(false)} resize-none`}
          />
        </Field>

        {submitError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {submitting ? "Completing..." : "Complete session"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full px-3 py-2 text-sm text-slate-800 bg-white border rounded-lg outline-none transition-colors
    placeholder:text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
    ${hasError ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}`;
}