const express = require("express");
const { check } = require("express-validator");
const { validation } = require("../middleware/validators");
const {
  getAll,
  getDentistDetails,
  getSelectedDentistFullDetails,
  updateDentistDetails,
  updateWorkDetails,
  getBlacklist,
  removeFromBlacklist,
} = require("../controllers/dentistController");
const router = express.Router();

//get all dentists
router.get("/", async (req, res) => {
  const accoundId = req.account.id;
  const { term } = req.query;

  try {
    const result = await getAll(accoundId, term);
    return res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

router.get("/details/", async (req, res) => {
  const accoundId = req.account.id;

  try {
    const result = await getDentistDetails(accoundId);
    return res.json({ ok: true, result });
  } catch {
    return rejectResponse(res, error);
  }
});

router.get("/details/:id", async (req, res) => {
  const dentistId = Number(req.params.id);

  try {
    const result = await getSelectedDentistFullDetails(dentistId);
    return res.json({ ok: true, result });
  } catch {
    return rejectResponse(res, error);
  }
});

//update dentist details
router.put(
  "/details",
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

    try {
      await updateDentistDetails({ type, city, phone, description }, accountId);
      res.status(202).json({ ok: true, message: "Details updated" });
    } catch (error) {
      return rejectResponse(res, error);
    }
  }
);

//update dentist work schedule
router.put("/schedule", async (req, res) => {
  const { days, start, end } = req.body;
  const dentistId = req.account.id;

  try {
    const result = await updateWorkDetails(days, start, end, dentistId);
    return res.json({ ok: true, result });
  } catch {
    return rejectResponse(res, error);
  }
});

//get all blacklisted patients by dentist
router.get("/blacklist", async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getBlacklist(dentistId);
    return res.json({ ok: true, result });
  } catch {
    return rejectResponse(res, error);
  }
});

//remove patient from blacklist
router.delete("/blacklist/:id", async (req, res) => {
  const dentistId = req.account.id;
  const patientId = req.params.id;

  try {
    await removeFromBlacklist(dentistId, patientId);
    return res.json({ ok: true, message: "Patient removed from blacklist" });
  } catch {
    return rejectResponse(res, error);
  }
});

module.exports = router;
