const express = require("express");
const router = express.Router();
const {
  getGlobalEvents,
  addGlobalEvent,
} = require("../controllers/eventController");

//get events
router.get("/", async (req, res) => {
  try {
    const result = await getGlobalEvents();
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

//get
router.post("/", async (req, res) => {
  const { title, description, date, start, end } = req.body;
  const dentistId = req.account.id;

  try {
    await addGlobalEvent({ title, description, date, start, end }, dentistId);
    return res.status(201).json({ ok: true, message: "Event added successfully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

module.exports = router;
