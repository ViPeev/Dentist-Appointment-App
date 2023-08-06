const express = require("express");
const router = express.Router();
const {
  ratePatient,
  rateDentist,
  getPatientRating,
  getDentistRating,
} = require("../controllers/ratingController");
const { authAs } = require("../middleware/guards");

router.get("/patient/", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;

  try {
    const result = await getPatientRating(patientId);
    return res.json({
      ok: true,
      result,
    });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/dentist/", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getDentistRating(dentistId);
    return res.json({
      ok: true,
      result,
    });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.post("/patient", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const { patientId, rating } = req.body;

  try {
    await ratePatient(patientId, rating, dentistId);
    return res.status(201).json({
      ok: true,
      message: "Patient rated successfully!",
    });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.post("/dentist", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;
  const { dentistId, rating, appointmentId } = req.body;

  try {
    await rateDentist(patientId, rating, dentistId, appointmentId);
    return res.status(201).json({
      ok: true,
      message: "Dentist rated successfully!",
    });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

module.exports = router;
