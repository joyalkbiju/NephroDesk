import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { Patient } from "../models/patient.model";
import { Session } from "../models/session.model";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/nephro-desk-test";

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}, 10000);

beforeEach(async () => {
  await Patient.deleteMany({});
  await Session.deleteMany({});
});

describe("GET /api/schedule/today", () => {
  it("returns 400 when unit param is missing", async () => {
    const res = await request(app).get("/api/schedule/today");
    expect(res.status).toBe(400);
  });

  it("returns empty array when no patients in unit", async () => {
    const res = await request(app).get("/api/schedule/today?unit=ICU");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns patients with not_started status when no sessions today", async () => {
    await Patient.create({
      name: "Test Patient",
      dob: "1970-01-01",
      unit: "ICU",
      dryWeightKg: 68,
    });

    const res = await request(app).get("/api/schedule/today?unit=ICU");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe("not_started");
    expect(res.body[0].session).toBeUndefined();
  });

  it("returns in_progress status when session is in progress", async () => {
    const patient = await Patient.create({
      name: "Test Patient",
      dob: "1970-01-01",
      unit: "ICU",
      dryWeightKg: 68,
    });

    await Session.create({
      patientId: patient._id,
      machineId: "HD-01",
      status: "in_progress",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      preWeightKg: 70,
      preBP: { systolic: 140, diastolic: 85 },
      notes: "",
      anomalies: [],
    });

    const res = await request(app).get("/api/schedule/today?unit=ICU");
    expect(res.status).toBe(200);
    expect(res.body[0].status).toBe("in_progress");
    expect(res.body[0].session).toBeDefined();
    expect(res.body[0].session.machineId).toBe("HD-01");
  });

  it("returns completed status when session is completed", async () => {
    const patient = await Patient.create({
      name: "Test Patient",
      dob: "1970-01-01",
      unit: "ICU",
      dryWeightKg: 68,
    });

    const now = new Date();
    await Session.create({
      patientId: patient._id,
      machineId: "HD-01",
      status: "completed",
      startTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      preWeightKg: 70,
      postWeightKg: 67,
      preBP: { systolic: 140, diastolic: 85 },
      postBP: { systolic: 138, diastolic: 82 },
      notes: "",
      anomalies: [],
    });

    const res = await request(app).get("/api/schedule/today?unit=ICU");
    expect(res.status).toBe(200);
    expect(res.body[0].status).toBe("completed");
    expect(res.body[0].session).toBeDefined();
    expect(res.body[0].session.machineId).toBe("HD-01");
  });

  it("includes anomalies in the session", async () => {
    const patient = await Patient.create({
      name: "Test Patient",
      dob: "1970-01-01",
      unit: "ICU",
      dryWeightKg: 68,
    });

    const now = new Date();
    await Session.create({
      patientId: patient._id,
      machineId: "HD-01",
      status: "completed",
      startTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      preWeightKg: 74,
      postWeightKg: 71,
      preBP: { systolic: 145, diastolic: 88 },
      postBP: { systolic: 165, diastolic: 95 },
      notes: "",
      anomalies: [
        { type: "WEIGHT_GAIN", value: 6, threshold: 4, severity: "critical" },
      ],
    });

    const res = await request(app).get("/api/schedule/today?unit=ICU");
    expect(res.body[0].session.anomalies).toHaveLength(1);
    expect(res.body[0].session.anomalies[0].type).toBe("WEIGHT_GAIN");
  });

  it("only returns patients from the requested unit", async () => {
    await Patient.create({ name: "ICU Patient", dob: "1970-01-01", unit: "ICU", dryWeightKg: 68 });
    await Patient.create({ name: "Ward Patient", dob: "1970-01-01", unit: "Ward A", dryWeightKg: 70 });

    const res = await request(app).get("/api/schedule/today?unit=ICU");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].patient.name).toBe("ICU Patient");
  });
});