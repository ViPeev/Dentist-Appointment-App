const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../middleware/validators");
const {
  getBlacklistedDentists,
  getBlacklistedPatients,
  blacklistDentist,
  blacklistPatient,
} = require("../controllers/blacklistController.js");
const { authAs } = require("../middleware/guards");
const responseHandler = require("../utils/responseHandler");

const router = express.Router();

router.get("/patients", async (req, res) => {
  const params = {
    res,
    controller: getBlacklistedPatients,
    deps: [],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/dentists", async (req, res) => {
  const params = {
    res,
    controller: getBlacklistedDentists,
    deps: [],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.post(
  "/dentist",
  authAs("PATIENT"),
  body("dentistId").isNumeric(),
  body("reason").isString(),
  validation(),
  async (req, res) => {
    const accountId = req.account.id;
    const { dentistId, reason } = req.body;

    const params = {
      res,
      controller: blacklistDentist,
      deps: [accountId, dentistId, reason],
      statusCode: 201,
      hasDataTransfer: false,
      message: "Dentist is blacklisted!",
    };

    await responseHandler(params);
    return;
  }
);

router.post(
  "/patient",
  authAs("DENTIST"),
  body("patientId").isNumeric(),
  body("reason").isString(),
  validation(),
  async (req, res) => {
    const accountId = req.account.id;
    const { patientId, reason } = req.body;

    const params = {
      res,
      controller: blacklistPatient,
      deps: [accountId, patientId, reason],
      statusCode: 201,
      hasDataTransfer: false,
      message: "Patient is blacklisted!",
    };

    await responseHandler(params);
    return;
  }
);

module.exports = router;
