const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../middleware/validators");
const {
  getBlacklistedDentists,
  getBlacklistedPatients,
  blacklistDentist,
  blacklistPatient,
} = require("../controllers/blacklistController.js");

const router = express.Router();

router.get("/patients", async (req, res) => {
  try {
    const result = await getBlacklistedPatients();
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/dentists", async (req, res) => {
  try {
    const result = await getBlacklistedDentists();
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.post(
  "/dentist",
  body("dentistId").isNumeric(),
  body("reason").isString(),
  validation(),
  async (req, res) => {
    const id = req.account.id;
    const { dentistId, reason } = req.body;

    try {
      await blacklistDentist(id, dentistId, reason);
      res.status(201).json({ ok: true, message: "Dentist is blacklisted!" });
    } catch (error) {
      return res
        .status(500)
        .send({ ok: false, message: "Internal server error!" });
    }
  }
);

router.post(
  "/patient",
  auth.asDentist,
  body("patientId").isNumeric(),
  body("reason").isString(),
  validation(),
  async (req, res) => {
    const id = req.account.id;
    const { patientId, reason } = req.body;

    try {
      await blacklistPatient(id, patientId, reason);
      res.status(201).json({ ok: true, message: "Patient is blacklisted!" });
    } catch (error) {
      return res
        .status(500)
        .send({ ok: false, message: "Internal server error!" });
    }
  }
);

module.exports = router;
