const express = require("express");
const {
  getBlacklist,
  removeFromBlacklist,
} = require("../controllers/patientController");
const responseHandler = require("../utils/responseHandler");
const { authAs } = require("../middleware/guards");

const router = express.Router();

//Get all blacklisted dentsits for a patient
router.get("/blacklist", authAs("PATIENT"), async (req, res) => {
  const accountId = req.account.id;
  const { term } = req.query;

  const params = {
    res,
    controller: getBlacklist,
    deps: [accountId, term],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//Remove dentist from patient's blacklist
router.delete("/blacklist/:dentistId", authAs("PATIENT"), async (req, res) => {
  const accountId = req.account.id;
  const dentistId = req.params.dentistId;

  const params = {
    res,
    controller: removeFromBlacklist,
    deps: [accountId, dentistId],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Success",
  };

  await responseHandler(params);
  return;
});

module.exports = router;
