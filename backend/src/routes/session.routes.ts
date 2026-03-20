import { Router, type Request, type Response } from "express";
import { Session } from "../models/session.model";
import { Patient } from "../models/patient.model";
import { detectAnomalies } from "../services/anomaly.service";

const router = Router();

// POST /api/sessions — start a new session (pre-values only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { patientId, machineId, startTime, preWeightKg, preBP } = req.body;

    if (!patientId || !machineId || !startTime || preWeightKg == null || !preBP) {
      res.status(400).json({ message: "patientId, machineId, startTime, preWeightKg and preBP are required" });
      return;
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const session = await Session.create({
      patientId,
      machineId,
      startTime: new Date(startTime),
      preWeightKg,
      preBP,
      status: "in_progress",
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to start session" });
  }
});

// PATCH /api/sessions/:id/complete — complete session (post-values + anomaly detection)
router.patch("/:id/complete", async (req: Request, res: Response) => {
  try {
    const { postWeightKg, postBP, endTime, notes } = req.body;

    if (postWeightKg == null || !postBP || !endTime) {
      res.status(400).json({ message: "postWeightKg, postBP and endTime are required" });
      return;
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    if (session.status === "completed") {
      res.status(400).json({ message: "Session is already completed" });
      return;
    }

    const end = new Date(endTime);
    if (end <= session.startTime) {
      res.status(400).json({ message: "endTime must be after startTime" });
      return;
    }

    const patient = await Patient.findById(session.patientId);
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const anomalies = detectAnomalies(
      {
        preWeightKg: session.preWeightKg,
        postBP,
        startTime: session.startTime,
        endTime: end,
      },
      patient.dryWeightKg
    );

    const updated = await Session.findByIdAndUpdate(
      req.params.id,
      {
        postWeightKg,
        postBP,
        endTime: end,
        notes: notes ?? "",
        anomalies,
        status: "completed",
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete session" });
  }
});

// PATCH /api/sessions/:id/notes — edit nurse notes
router.patch("/:id/notes", async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;

    if (notes == null) {
      res.status(400).json({ message: "notes field is required" });
      return;
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notes" });
  }
});

export default router;