import mongoose, { Schema, Document } from "mongoose";

export type AnomalyType =
  | "WEIGHT_GAIN"
  | "HIGH_POST_BP"
  | "SHORT_SESSION"
  | "LONG_SESSION";

export type AnomalySeverity = "warning" | "critical";
export type SessionStatus = "in_progress" | "completed";

export interface IAnomaly {
  type: AnomalyType;
  value: number;
  threshold: number;
  severity: AnomalySeverity;
}

export interface IBP {
  systolic: number;
  diastolic: number;
}

export interface ISession extends Document {
  patientId: mongoose.Types.ObjectId;
  machineId: string;
  status: SessionStatus;
  startTime: Date;
  endTime?: Date;
  preWeightKg: number;
  postWeightKg?: number;
  preBP: IBP;
  postBP?: IBP;
  notes: string;
  anomalies: IAnomaly[];
  createdAt: Date;
}

const BPSchema = new Schema<IBP>(
  {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
  },
  { _id: false }
);

const AnomalySchema = new Schema<IAnomaly>(
  {
    type: {
      type: String,
      required: true,
      enum: ["WEIGHT_GAIN", "HIGH_POST_BP", "SHORT_SESSION", "LONG_SESSION"],
    },
    value: { type: Number, required: true },
    threshold: { type: Number, required: true },
    severity: { type: String, required: true, enum: ["warning", "critical"] },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    machineId: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    preWeightKg: { type: Number, required: true },
    postWeightKg: { type: Number },
    preBP: { type: BPSchema, required: true },
    postBP: { type: BPSchema },
    notes: { type: String, default: "" },
    anomalies: { type: [AnomalySchema], default: [] },
  },
  { timestamps: true }
);

SessionSchema.index({ patientId: 1 });
SessionSchema.index({ startTime: 1 });

export const Session = mongoose.model<ISession>("Session", SessionSchema);