const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../utils/validators");
const { register, login } = require("../controllers/authController");

const router = express.Router();

//POST: /auth - Register new user
router.post(
  "/",
  body("firstName").isAlpha(),
  body("lastName").isAlpha(),
  body("email").isEmail(),
  body("password").isLength({
    min: 5,
  }),
  body("role").isIn([2, 3]),
  validation(),
  async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
      const result = await register(firstName, lastName, email, password, role);
      res.json({ ok: true, userData: result });
    } catch (error) {
      return res
        .status(500)
        .send({ ok: false, message: "Internal server error!" });
    }
  }
);

//POST: /auth/login - User login

router.post(
  "/login",
  body("email").isEmail(),
  validation(),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await login(email, password);
      res.json({ ok: true, userData: result });
    } catch (error) {
      return res
        .status(500)
        .send({ ok: false, message: "Internal server error!" });
    }
  }
);

//GET: /auth/login - User login
router.get("/logout", (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
