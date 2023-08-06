const express = require("express");
const {
  getAppointmentsPatient,
  getPendingAppointmentsDentist,
  getCalendarAppointmentsPatient,
  getAppointmentPatient,
  getAppointmentDentist,
  getCalendarAppointmentDentist,
  scheduleAppointmentPatient,
  updateAppointmentStatus,
} = require("../controllers/appointmentsController");
const { isAuthenticated, authAs } = require("../middleware/guards");

const router = express.Router();

router.get("/history", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;

  try {
    const result = await getAppointmentsPatient(patientId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/all", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getPendingAppointmentsDentist(dentistId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/dentist/:id", isAuthenticated, async (req, res) => {
  const dentistId = Number(req.params.id);

  try {
    const result = await getCalendarAppointmentsPatient(dentistId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/patient/:id", authAs("DENTIST"), async (req, res) => {
  const appointmentId = Number(req.params.id);

  try {
    const result = await getAppointmentPatient(appointmentId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/:id", authAs("DENTIST"), async (req, res) => {
  const appointmentId = Number(req.params.id);

  try {
    const result = await getAppointmentDentist(appointmentId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/", authAs("DENTIST"), async (req, res) => {
  const id = req.account.id;

  try {
    const result = await getCalendarAppointmentDentist(id);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.post("/", authAs("PATIENT"), async (req, res) => {
  const id = req.account.id;
  const { dentist, date, start, end } = req.body;

  try {
    await scheduleAppointmentPatient(id, dentist, date, start, end);
    res.status(201).json({ ok: true, message: "Appointment scheduled" });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.put("/complete/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { patientId } = req.body;

  try {
    await updateAppointmentStatus(
      dentistId,
      patientId,
      appointmentId,
      "Completed"
    );
    res.status(202).json({ ok: true, message: "Appointment completed" });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.put("/cancel/:id", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { dentistId } = req.body;

  try {
    await updateAppointmentStatus(
      dentistId,
      patientId,
      appointmentId,
      "Cancelled"
    );
    res.status(202).json({ ok: true, message: "Appointment canceled" });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.put("/reject/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { patientId } = req.body;

  try {
    await updateAppointmentStatus(
      dentistId,
      patientId,
      appointmentId,
      "Cancelled"
    );
    res.status(202).json({ ok: true, message: "Appointment rejected" });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.put("/accept/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { patientId } = req.body;

  try {
    await updateAppointmentStatus(
      dentistId,
      patientId,
      appointmentId,
      "Accepted"
    );
    res.status(202).json({ ok: true, message: "Appointment accepted" });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

module.exports = router;
