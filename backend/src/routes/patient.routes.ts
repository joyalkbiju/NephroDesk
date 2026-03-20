import { Router, type Request, type Response } from "express";
import { Patient } from "../models/patient.model";

const router = Router();

// POST /api/patients — register a new patient
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, dob, unit, dryWeightKg } = req.body;

    if (!name || !dob || !unit || dryWeightKg == null) {
      res.status(400).json({ message: "name, dob, unit and dryWeightKg are required" });
      return;
    }

    const patient = await Patient.create({ name, dob, unit, dryWeightKg });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Failed to register patient" });
  }
});

// GET /api/patients — list all patients
router.get("/", async (_req: Request, res: Response) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

export default router;