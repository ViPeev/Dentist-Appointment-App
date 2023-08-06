const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../middleware/validators");
const { register, login } = require("../controllers/authController");
const { isAuthenticated, isNotAuthenticated } = require("../middleware/guards");

const router = express.Router();

//post /auth - Register new user
router.post(
  "/",
  isNotAuthenticated,
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
      return rejectResponse(res, error);
    }
  }
);

//post /auth/login - User login

router.post(
  "/login",
  isNotAuthenticated,
  body("email").isEmail(),
  validation(),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await login(email, password);
      res.json({ ok: true, userData: result });
    } catch (error) {
      return rejectResponse(res, error);
    }
  }
);

//GET: /auth/logout - User logout
router.get("/logout", isAuthenticated, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
