const express = require("express");
const router = express.Router();
const {
  ratePatient,
  rateDentist,
  getPatientRating,
  getDentistRating,
} = require("../controllers/ratingController");
const responseHandler = require("../utils/responseHandler");
const { authAs } = require("../middleware/guards");

router.get("/patient/", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;

  const params = {
    res,
    controller: getPatientRating,
    deps: [patientId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/dentist/", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  const params = {
    res,
    controller: getDentistRating,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.post("/patient", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const { patientId, rating } = req.body;

  const params = {
    res,
    controller: ratePatient,
    deps: [patientId, rating, dentistId],
    statusCode: 201,
    hasDataTransfer: false,
    message: "Patient rated successfully!",
  };

  await responseHandler(params);
  return;
});

router.post("/dentist", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;
  const { dentistId, rating, appointmentId } = req.body;

  const params = {
    res,
    controller: rateDentist,
    deps: [patientId, rating, dentistId, appointmentId],
    statusCode: 201,
    hasDataTransfer: false,
    message: "Dentist rated successfully!",
  };

  await responseHandler(params);
  return;
});

module.exports = router;
