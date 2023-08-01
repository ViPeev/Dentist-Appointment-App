const express = require("express");
const router = express.Router();
const {
  ratePatient,
  rateDentist,
  getPatientRating,
  getDentistRating,
} = require("../controllers/ratingController");

router.get("/patient/", async (req, res) => {
  const patientId = req.account.id;

  try {
    const result = await getPatientRating(patientId);
    return res.json({
      ok: true,
      result,
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: "Internal server error!",
    });
  }
});

router.get("/dentist/", async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getDentistRating(dentistId);
    return res.json({
      ok: true,
      result,
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: "Internal server error!",
    });
  }
});

router.post("/patient", async (req, res) => {
  const dentistId = req.account.id;
  const { patientId, rating } = req.body;

  try {
    await ratePatient(patientId, rating, dentistId);
    return res.status(201).json({
      ok: true,
      message: "Patient rated successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: "Internal server error!",
    });
  }
});

router.post("/dentist", async (req, res) => {
  const patientId = req.account.id;
  const { dentistId, rating, appointmentId } = req.body;

  try {
    await rateDentist(patientId, rating, dentistId, appointmentId);
    return res.status(201).json({
      ok: true,
      message: "Dentist rated successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: "Internal server error!",
    });
  }
});

module.exports = router;
