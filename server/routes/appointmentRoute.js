const express = require("express");
const router = express.Router();

const {
  getAppointmentsPatient,
  getPendingAppointmentsDentist,
  getCalendarAppointmentsPatient,
  getAppointmentPatient,
  getAppointmentDentist,
  getCalendarAppointmentDentist,
  scheduleAppointmentPatient,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

router.get("/history", async (req, res) => {
  const patientId = req.account.id;

  try {
    const result = await getAppointmentsPatient(patientId);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/all", async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getPendingAppointmentsDentist(dentistId);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/dentist/:id", async (req, res) => {
  const dentistId = Number(req.params.id);

  try {
    const result = await getCalendarAppointmentsPatient(dentistId);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/patient/:id", async (req, res) => {
  const appointmentId = Number(req.params.id);

  try {
    const result = await getAppointmentPatient(appointmentId);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/:id", async (req, res) => {
  const appointmentId = Number(req.params.id);

  try {
    const result = await getAppointmentDentist(appointmentId);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/", async (req, res) => {
  const id = req.account.id;

  try {
    const result = await getCalendarAppointmentDentist(id);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.post("/", async (req, res) => {
  const id = req.account.id;
  const { dentist, date, start, end } = req.body;

  try {
    await scheduleAppointmentPatient(id, dentist, date, start, end);
    res.status(201).json({ ok: true, message: "Appointment scheduled" });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.put("/complete/:id", async (req, res) => {
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
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.put("/cancel/:id", async (req, res) => {
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
    res.status(202).json({ ok: true,  message: "Appointment canceled" });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.put("/reject/:id", async (req, res) => {
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
    res.status(202).json({ ok: true,  message: "Appointment rejected" });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.put("/accept/:id", async (req, res) => {
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
    res.status(202).json({ ok: true,  message: "Appointment accepted" });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

module.exports = router;
