import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes";
import sessionRoutes from "./routes/session.routes";
import scheduleRoutes from "./routes/schedule.routes";

const app = express();

app.use(cors({ origin: ["http://localhost:5173",
  "https://nephrodesk-frontend.onrender.com"]
 }));
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/schedule", scheduleRoutes);

// health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;