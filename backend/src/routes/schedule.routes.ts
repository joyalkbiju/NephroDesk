import { Router, type Request, type Response } from "express";
import { Patient } from "../models/patient.model";
import { Session } from "../models/session.model";

const router = Router();

// GET /api/schedule/today?unit=ICU
router.get("/today", async (req: Request, res: Response) => {
  try {
    const { unit } = req.query;

    if (!unit || typeof unit !== "string") {
      res.status(400).json({ message: "unit query param is required" });
      return;
    }

    const patients = await Patient.find({ unit }).sort({ name: 1 });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const patientIds = patients.map((p) => p._id);
    const sessions = await Session.find({
      patientId: { $in: patientIds },
      startTime: { $gte: todayStart, $lte: todayEnd },
    });

    const sessionMap = new Map(
      sessions.map((s) => [s.patientId.toString(), s])
    );

    const schedule = patients.map((patient) => {
      const session = sessionMap.get(patient._id.toString());

      let status: "not_started" | "in_progress" | "completed";
      if (!session) {
        status = "not_started";
      } else {
        status = session.status; // driven by session.status field directly
      }

      return {
        patient,
        session: session ?? undefined,
        status,
      };
    });

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
});

export default router;