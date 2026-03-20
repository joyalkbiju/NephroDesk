import { useState } from "react";
import Modal from "../ui/Modal";
import { startSession } from "../../api/sessions.api";
import type { Patient } from "../../types/patient.types";

interface StartSessionFormProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  machineId: string;
  preWeightKg: string;
  preSystolic: string;
  preDiastolic: string;
  startTime: string;
}

export default function StartSessionForm({ patient, onClose, onSuccess }: StartSessionFormProps) {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [form, setForm] = useState<FormState>({
    machineId: "",
    preWeightKg: "",
    preSystolic: "",
    preDiastolic: "",
    startTime: localNow,
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
    if (!form.machineId.trim()) e.machineId = "Required";
    if (!form.preWeightKg || isNaN(Number(form.preWeightKg)))
      e.preWeightKg = "Enter a valid weight";
    if (!form.preSystolic || isNaN(Number(form.preSystolic)))
      e.preSystolic = "Required";
    if (!form.preDiastolic || isNaN(Number(form.preDiastolic)))
      e.preDiastolic = "Required";
    if (!form.startTime) e.startTime = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await startSession({
        patientId: patient._id,
        machineId: form.machineId.trim(),
        startTime: new Date(form.startTime).toISOString(),
        preWeightKg: Number(form.preWeightKg),
        preBP: {
          systolic: Number(form.preSystolic),
          diastolic: Number(form.preDiastolic),
        },
      });
      onSuccess();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose} title={`Start session — ${patient.name}`}>
      <div className="flex flex-col gap-5">

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
          <p className="text-xs text-cyan-700 font-medium">
            Dry weight: {patient.dryWeightKg} kg
          </p>
          <p className="text-xs text-cyan-600 mt-0.5">
            Post-weight and post-BP will be recorded when the session is completed.
          </p>
        </div>

        <Field label="Machine ID" error={errors.machineId}>
          <input
            type="text"
            placeholder="e.g. HD-04"
            value={form.machineId}
            onChange={(e) => set("machineId", e.target.value)}
            className={inputClass(!!errors.machineId)}
          />
        </Field>

        <Field label="Pre-weight (kg)" error={errors.preWeightKg}>
          <input
            type="number"
            step="0.1"
            placeholder="72.5"
            value={form.preWeightKg}
            onChange={(e) => set("preWeightKg", e.target.value)}
            className={inputClass(!!errors.preWeightKg)}
          />
        </Field>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">
            Pre-dialysis BP (mmHg)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Systolic" error={errors.preSystolic}>
              <input
                type="number"
                placeholder="130"
                value={form.preSystolic}
                onChange={(e) => set("preSystolic", e.target.value)}
                className={inputClass(!!errors.preSystolic)}
              />
            </Field>
            <Field label="Diastolic" error={errors.preDiastolic}>
              <input
                type="number"
                placeholder="80"
                value={form.preDiastolic}
                onChange={(e) => set("preDiastolic", e.target.value)}
                className={inputClass(!!errors.preDiastolic)}
              />
            </Field>
          </div>
        </div>

        <Field label="Start time" error={errors.startTime}>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => set("startTime", e.target.value)}
            className={inputClass(!!errors.startTime)}
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
            className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {submitting ? "Starting..." : "Start session"}
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