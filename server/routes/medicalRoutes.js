const express = require("express");
const {
  createRecord,
  getPatients,
  getDentists,
  getPatientMedicalRecord,
  getPatientMedicalRecordByDentist,
} = require("../controllers/medicalRecordController");
const responseHandler = require("../utils/responseHandler");
const { authAs } = require("../middleware/guards");

const router = express.Router();

//get dentists by patient
router.get("/dentists", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;

  const params = {
    res,
    controller: getDentists,
    deps: [patientId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/dentists/:id", authAs("PATIENT"), async (req, res) => {
  const dentistId = req.params.id;
  const patientId = req.account.id;

  const params = {
    res,
    controller: getPatientMedicalRecordByDentist,
    deps: [patientId, dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/:id", authAs("DENTIST"), async (req, res) => {
  const patientId = Number(req.params.id);
  const dentistId = req.account.id;

  const params = {
    res,
    controller: getPatientMedicalRecord,
    deps: [dentistId, patientId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  const params = {
    res,
    controller: getPatients,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.post("/", authAs("DENTIST"), async (req, res) => {
  const { details, patientId, appointmentId } = req.body;
  const dentistId = req.account.id;

  const params = {
    res,
    controller: createRecord,
    deps: [{ details, patientId, appointmentId }, dentistId],
    statusCode: 201,
    hasDataTransfer: false,
    message: "Medical record created successfully.",
  };

  await responseHandler(params);
  return;
});

module.exports = router;
