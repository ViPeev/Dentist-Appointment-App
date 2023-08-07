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
const responseHandler = require("../utils/responseHandler");

const router = express.Router();

router.get("/history", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;

  const params = {
    res,
    controller: getAppointmentsPatient,
    deps: [patientId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/all", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  const params = {
    res,
    controller: getPendingAppointmentsDentist,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/dentist/:id", isAuthenticated, async (req, res) => {
  const dentistId = Number(req.params.id);

  const params = {
    res,
    controller: getCalendarAppointmentsPatient,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/patient/:id", authAs("DENTIST"), async (req, res) => {
  const appointmentId = Number(req.params.id);

  const params = {
    res,
    controller: getAppointmentPatient,
    deps: [appointmentId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/:id", authAs("DENTIST"), async (req, res) => {
  const appointmentId = Number(req.params.id);

  const params = {
    res,
    controller: getAppointmentDentist,
    deps: [appointmentId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/", authAs("DENTIST"), async (req, res) => {
  const accountId = req.account.id;

  const params = {
    res,
    controller: getCalendarAppointmentDentist,
    deps: [accountId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.post("/", authAs("PATIENT"), async (req, res) => {
  const accountId = req.account.id;
  const { dentist, date, start, end } = req.body;

  const params = {
    res,
    controller: scheduleAppointmentPatient,
    deps: [accountId, dentist, date, start, end],
    statusCode: 201,
    hasDataTransfer: false,
    message: "Appointment scheduled",
  };

  await responseHandler(params);
  return;
});

router.put("/complete/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { patientId } = req.body;

  const params = {
    res,
    controller: updateAppointmentStatus,
    deps: [dentistId, patientId, appointmentId, "Completed"],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Appointment completed",
  };

  await responseHandler(params);
  return;
});

router.put("/cancel/:id", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { dentistId } = req.body;

  const params = {
    res,
    controller: updateAppointmentStatus,
    deps: [dentistId, patientId, appointmentId, "Cancelled"],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Appointment canceled",
  };

  await responseHandler(params);
  return;
});

router.put("/reject/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { patientId } = req.body;

  const params = {
    res,
    controller: updateAppointmentStatus,
    deps: [dentistId, patientId, appointmentId, "Cancelled"],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Appointment rejected",
  };

  await responseHandler(params);
  return;
});

router.put("/accept/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const appointmentId = parseInt(req.params.id);
  const { patientId } = req.body;

  const params = {
    res,
    controller: updateAppointmentStatus,
    deps: [dentistId, patientId, appointmentId, "Accepted"],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Appointment accepted",
  };

  await responseHandler(params);
  return;
});

module.exports = router;
