import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Patient } from "./models/patient.model";
import { Session } from "./models/session.model";
import { detectAnomalies } from "./services/anomaly.service";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/nephro-desk";

const SEED_PATIENTS = [
  { name: "Arun Kumar",     dob: "1970-03-15", unit: "ICU",    dryWeightKg: 68.0 },
  { name: "Meera Nair",     dob: "1965-07-22", unit: "ICU",    dryWeightKg: 55.0 },
  { name: "Rajesh Menon",   dob: "1958-11-05", unit: "ICU",    dryWeightKg: 72.0 },
  { name: "Lakshmi Pillai", dob: "1975-02-18", unit: "ICU",    dryWeightKg: 62.0 },
  { name: "Suresh Babu",    dob: "1980-09-30", unit: "Ward A", dryWeightKg: 74.5 },
  { name: "Priya Thomas",   dob: "1990-04-12", unit: "Ward A", dryWeightKg: 51.0 },
  { name: "Anand Krishnan", dob: "1955-12-01", unit: "Ward B", dryWeightKg: 80.0 },
  { name: "Deepa Varghese", dob: "1968-06-25", unit: "HDU",    dryWeightKg: 58.5 },
] as const;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Patient.deleteMany({});
  await Session.deleteMany({});
  console.log("Cleared existing data");

  const patients = await Patient.insertMany(SEED_PATIENTS);
  console.log(`Inserted ${patients.length} patients`);

  const today = new Date();

  // Arun — completed with anomalies (weight gain + high BP)
  const arunStart = new Date(today.getTime() - 5 * 60 * 60 * 1000);
  const arunEnd   = new Date(today.getTime() - 1 * 60 * 60 * 1000);
  const arunAnomalies = detectAnomalies(
    {
      preWeightKg: 73.5,
      postBP: { systolic: 165, diastolic: 95 },
      startTime: arunStart,
      endTime: arunEnd,
    },
    patients[0].dryWeightKg
  );
  await Session.create({
    patientId: patients[0]._id,
    machineId: "HD-01",
    status: "completed",
    startTime: arunStart,
    endTime: arunEnd,
    preWeightKg: 73.5,
    postWeightKg: 70.2,
    preBP: { systolic: 145, diastolic: 88 },
    postBP: { systolic: 165, diastolic: 95 },
    notes: "Patient tolerated session well. Mild cramping at 3h mark.",
    anomalies: arunAnomalies,
  });

  // Meera — in progress (no endTime, no post-values)
  const meeraStart = new Date(today.getTime() - 2 * 60 * 60 * 1000);
  await Session.create({
    patientId: patients[1]._id,
    machineId: "HD-02",
    status: "in_progress",
    startTime: meeraStart,
    preWeightKg: 58.2,
    preBP: { systolic: 130, diastolic: 80 },
    notes: "",
    anomalies: [],
  });

  // Lakshmi — completed with short session warning
  const lakshmiStart = new Date(today.getTime() - 6.0 * 60 * 60 * 1000);
  const lakshmiEnd   = new Date(today.getTime() - 2.5 * 60 * 60 * 1000);
  const lakshmiAnomalies = detectAnomalies(
    {
      preWeightKg: 63.8,
      postBP: { systolic: 142, diastolic: 88 },
      startTime: lakshmiStart,
      endTime: lakshmiEnd,
    },
    patients[3].dryWeightKg
  );
  await Session.create({
    patientId: patients[3]._id,
    machineId: "HD-03",
    status: "completed",
    startTime: lakshmiStart,
    endTime: lakshmiEnd,
    preWeightKg: 63.8,
    postWeightKg: 61.5,
    preBP: { systolic: 138, diastolic: 85 },
    postBP: { systolic: 142, diastolic: 88 },
    notes: "Session ended early due to access issues.",
    anomalies: lakshmiAnomalies,
  });

  console.log("Inserted 3 sessions");
  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});