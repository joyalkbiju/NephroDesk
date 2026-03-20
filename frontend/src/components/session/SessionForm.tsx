import { useState } from "react";
import Modal from "../ui/Modal";
import { createSession } from "../../api/sessions.api";
import type { Patient } from "../../types/patient.types";

interface SessionFormProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  machineId: string;
  preWeightKg: string;
  postWeightKg: string;
  preSystolic: string;
  preDiastolic: string;
  postSystolic: string;
  postDiastolic: string;
  startTime: string;
  endTime: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  machineId: "",
  preWeightKg: "",
  postWeightKg: "",
  preSystolic: "",
  preDiastolic: "",
  postSystolic: "",
  postDiastolic: "",
  startTime: "",
  endTime: "",
  notes: "",
};

export default function SessionForm({
  patient,
  onClose,
  onSuccess,
}: SessionFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
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
    if (!form.postWeightKg || isNaN(Number(form.postWeightKg)))
      e.postWeightKg = "Enter a valid weight";
    if (!form.preSystolic || isNaN(Number(form.preSystolic)))
      e.preSystolic = "Required";
    if (!form.preDiastolic || isNaN(Number(form.preDiastolic)))
      e.preDiastolic = "Required";
    if (!form.postSystolic || isNaN(Number(form.postSystolic)))
      e.postSystolic = "Required";
    if (!form.postDiastolic || isNaN(Number(form.postDiastolic)))
      e.postDiastolic = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.endTime) e.endTime = "Required";
    if (form.startTime && form.endTime && form.endTime <= form.startTime)
      e.endTime = "Must be after start time";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createSession({
        patientId: patient._id,
        machineId: form.machineId.trim(),
        preWeightKg: Number(form.preWeightKg),
        postWeightKg: Number(form.postWeightKg),
        preBP: {
          systolic: Number(form.preSystolic),
          diastolic: Number(form.preDiastolic),
        },
        postBP: {
          systolic: Number(form.postSystolic),
          diastolic: Number(form.postDiastolic),
        },
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        notes: form.notes.trim(),
      });
      onSuccess();
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save session"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose} title={`New session — ${patient.name}`}>
      <div className="flex flex-col gap-5">

        {/* Machine ID */}
        <Field label="Machine ID" error={errors.machineId}>
          <input
            type="text"
            placeholder="e.g. HD-04"
            value={form.machineId}
            onChange={(e) => set("machineId", e.target.value)}
            className={inputClass(!!errors.machineId)}
          />
        </Field>

        {/* Weight */}
        <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Pre BP */}
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

        {/* Post BP */}
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

        {/* Times */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start time" error={errors.startTime}>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => set("startTime", e.target.value)}
              className={inputClass(!!errors.startTime)}
            />
          </Field>
          <Field label="End time" error={errors.endTime}>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => set("endTime", e.target.value)}
              className={inputClass(!!errors.endTime)}
            />
          </Field>
        </div>

        {/* Notes */}
        <Field label="Nurse notes (optional)">
          <textarea
            rows={3}
            placeholder="Any observations during the session..."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`${inputClass(false)} resize-none`}
          />
        </Field>

        {/* Submit error */}
        {submitError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        {/* Actions */}
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
            {submitting ? "Saving..." : "Save session"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Internal helpers ── */

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
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
    placeholder:text-slate-300
    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
    ${hasError ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"}`;
}