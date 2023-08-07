const express = require("express");
const router = express.Router();
const {
  reviewDentist,
  getReviews,
} = require("../controllers/reviewController");
const { isAuthenticated, authAs } = require("../middleware/guards");
const responseHandler = require("../utils/responseHandler");

//get dentist reviews for patient view
router.get("/:id", isAuthenticated, async (req, res) => {
  const dentistId = req.params.id;

  const params = {
    res,
    controller: getReviews,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//get dentist own reviews
router.get("/", authAs("DENTIST"), async (req, res) => {
  const dentistId = req.account.id;

  const params = {
    res,
    controller: getReviews,
    deps: [dentistId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//patient reviews a dentist
router.post("/", authAs("PATIENT"), async (req, res) => {
  const patientId = req.account.id;
  const { details, dentistId, appointmentId } = req.body;

  const params = {
    res,
    controller: reviewDentist,
    deps: [{ details, dentistId, appointmentId }, patientId],
    statusCode:201,
    hasDataTransfer: true,
    message: "Review created successfully"
  };

  await responseHandler(params);
  return;
});

module.exports = router;
