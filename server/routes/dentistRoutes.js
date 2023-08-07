const express = require("express");
const { check } = require("express-validator");
const { validation } = require("../middleware/validators");
const { isAuthenticated, authAs } = require("../middleware/guards");
const {
  getAll,
  getDentistDetails,
  getSelectedDentistFullDetails,
  updateDentistDetails,
  updateWorkDetails,
  getBlacklist,
  removeFromBlacklist,
} = require("../controllers/dentistController");
const responseHandler = require("../utils/responseHandler");

const router = express.Router();

//get all dentists
router.get("/", isAuthenticated, async (req, res) => {
  const accountId = req.account.id;
  const { term } = req.query;

  const params = {
    res,
    controller: getAll,
    deps: [accountId, term],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/details/", authAs("DENTIST"), async (req, res) => {
  const accountId = req.account.id;

  const params = {
    res,
    controller: getDentistDetails,
    deps: [accountId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

router.get("/details/:id", isAuthenticated, async (req, res) => {
  const dentistId = Number(req.params.id);

  const params = {
    res,
    controller: getSelectedDentistFullDetails,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//update dentist details
router.put(
  "/details",
  authAs("DENTIST"),
  check("phone").isAlphanumeric().optional({ checkFalsy: true }),
  check("description").isLength({ max: 255 }).optional({ checkFalsy: true }),
  validation(),
  async (req, res) => {
    const { type, city, phone, description } = req.body;
    const accountId = req.account.id;

    if (!type && !city && !phone && !description) {
      return res.status(400).json({
        ok: "false",
        message: "Bad Request!",
      });
    }

    const params = {
      res,
      controller: updateDentistDetails,
      deps: [{ type, city, phone, description }, accountId],
      statusCode: 202,
      hasDataTransfer: false,
      message: "Details successfully updated",
    };

    await responseHandler(params);
    return;
  }
);

//update dentist work schedule
router.put("/schedule", authAs("DENTIST"), async (req, res) => {
  const { days, start, end } = req.body;
  const dentistId = req.account.id;

  const params = {
    res,
    controller: updateWorkDetails,
    deps: [days, start, end, dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//get all blacklisted patients by dentist
router.get("/blacklist", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  const params = {
    res,
    controller: getBlacklist,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//remove patient from blacklist
router.delete("/blacklist/:id", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;
  const patientId = req.params.id;

  const params = {
    res,
    controller: removeFromBlacklist,
    deps: [dentistId, patientId],
    hasDataTransfer: false,
    message: "Patient removed from blacklist",
  };

  await responseHandler(params);
  return;
});

module.exports = router;
