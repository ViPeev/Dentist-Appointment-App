const express = require("express");
const {
  getGlobalEvents,
  addGlobalEvent,
} = require("../controllers/eventController");
const responseHandler = require("../utils/responseHandler");
const { authAs } = require("../middleware/guards");

const router = express.Router();

//get events
router.get("/", async (req, res) => {
  const params = {
    res,
    controller: getGlobalEvents,
    deps: [],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//get
router.post("/", authAs("DENTIST"), async (req, res) => {
  const { title, description, date, start, end } = req.body;
  const dentistId = req.account.id;

  const params = {
    res,
    controller: addGlobalEvent,
    deps: [{ title, description, date, start, end }, dentistId],
    statusCode: 201,
    hasDataTransfer: false,
    message: "Event added successfully!",
  };

  await responseHandler(params);
  return;
});

module.exports = router;
