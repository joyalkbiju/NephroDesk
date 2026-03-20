import mongoose, { Schema, Document } from "mongoose";

export type Unit = "ICU" | "Ward A" | "Ward B" | "HDU";

export interface IPatient extends Document {
  name: string;
  dob: Date;
  unit: Unit;
  dryWeightKg: number;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    unit: {
      type: String,
      required: true,
      enum: ["ICU", "Ward A", "Ward B", "HDU"],
    },
    dryWeightKg: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

PatientSchema.index({ unit: 1 });

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);