import { useState } from "react";
import Modal from "../ui/Modal";
import { registerPatient } from "../../api/patients.api";
import type { Unit } from "../../types/patient.types";

interface RegisterPatientFormProps {
  defaultUnit: Unit;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  name: string;
  dob: string;
  unit: Unit;
  dryWeightKg: string;
}

const UNITS: Unit[] = ["ICU", "Ward A", "Ward B", "HDU"];

export default function RegisterPatientForm({
  defaultUnit,
  onClose,
  onSuccess,
}: RegisterPatientFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    dob: "",
    unit: defaultUnit,
    dryWeightKg: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.dob) e.dob = "Required";
    if (!form.dryWeightKg || isNaN(Number(form.dryWeightKg)))
      e.dryWeightKg = "Enter a valid weight";
    else if (Number(form.dryWeightKg) <= 0)
      e.dryWeightKg = "Weight must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await registerPatient({
        name: form.name.trim(),
        dob: form.dob,
        unit: form.unit,
        dryWeightKg: Number(form.dryWeightKg),
      });
      onSuccess();
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to register patient"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Register new patient">
      <div className="flex flex-col gap-5">

        {/* Name */}
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            placeholder="e.g. Arun Kumar"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass(!!errors.name)}
          />
        </Field>

        {/* DOB */}
        <Field label="Date of birth" error={errors.dob}>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => set("dob", e.target.value)}
            className={inputClass(!!errors.dob)}
          />
        </Field>

        {/* Unit */}
        <Field label="Unit">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {UNITS.map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => set("unit", unit)}
                className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer
                  ${
                    form.unit === unit
                      ? "bg-cyan-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </Field>

        {/* Dry weight */}
        <Field label="Dry weight (kg)" error={errors.dryWeightKg}>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 68.0"
            value={form.dryWeightKg}
            onChange={(e) => set("dryWeightKg", e.target.value)}
            className={inputClass(!!errors.dryWeightKg)}
          />
          <p className="text-xs text-slate-400 mt-1">
            The patient's target post-dialysis weight.
          </p>
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
            {submitting ? "Registering..." : "Register patient"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

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