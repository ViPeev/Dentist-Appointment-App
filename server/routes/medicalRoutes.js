const express = require("express");
const router = express.Router();
const {
  createRecord,
  getPatients,
  getDentists,
  getPatientMedicalRecord,
  getPatientMedicalRecordByDentist,
} = require("../controllers/medicalRecordController");

//get dentists by patient
router.get("/dentists", async (req, res) => {
  const patientId = req.account.id;

  try {
    const result = await getDentists(patientId);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/dentists/:id", async (req, res) => {
  const dentistId = req.params.id;
  const patientId = req.account.id;

  try {
    const result = await getPatientMedicalRecordByDentist(patientId, dentistId);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/:id", async (req, res) => {
  const patientId = Number(req.params.id);
  const dentistId = req.account.id;

  try {
    const result = await getPatientMedicalRecord(dentistId, patientId);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.get("/", async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getPatients(dentistId);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

router.post("/", async (req, res) => {
  const { details, patientId, appointmentId } = req.body;
  const dentistId = req.account.id;

  try {
    await createRecord({ details, patientId, appointmentId }, dentistId);
    
    return res
      .status(201)
      .json({ ok: true, message: "Medical record created successfully." });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

module.exports = router;
