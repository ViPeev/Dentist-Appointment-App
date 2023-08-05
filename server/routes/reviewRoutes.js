const express = require("express");
const router = express.Router();
const {
  reviewDentist,
  getReviews,
} = require("../controllers/reviewController");

//get dentist reviews for patient view
router.get("/:id", async (req, res) => {
  const dentistId = req.params.id;

  try {
    const result = await getReviews(dentistId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

//get dentist own reviews
router.get("/", async (req, res) => {
  const dentistId = req.account.id;

  try {
    const result = await getReviews(dentistId);
    res.json({ ok: true, result });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

//patient reviews a dentist
router.post("/", async (req, res) => {
  const patientId = req.account.id;
  const { details, dentistId, appointmentId } = req.body;

  try {
    await reviewDentist({ details, dentistId, appointmentId }, patientId);
    return res.status(201).json({
      ok: true,
      message: "Review created successfully",
    });
  } catch (error) {
    return rejectResponse(res, error);
  }
});

module.exports = router;
