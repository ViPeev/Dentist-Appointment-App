const express = require("express");
const router = express.Router();
const {
  getBlacklist,
  removeFromBlacklist,
} = require("../controllers/patientController");

//Get all blacklisted dentsits for a patient
router.get("/blacklist", async (req, res) => {
  const accountId = req.account.id;
  const { term } = req.query;

  try {
    const result = await getBlacklist(accountId, term);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

//Remove dentist from patient's blacklist
router.delete("/blacklist/:dentistId", async (req, res) => {
  const accountId = req.account.id;
  const dentistId = req.params.dentistId;

  try {
    await removeFromBlacklist(accountId, dentistId);
    return res
      .status(202)
      .json({ ok: true, message: "Success" });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

module.exports = router;