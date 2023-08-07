const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../middleware/validators");
const { register, login } = require("../controllers/authController");
const { isAuthenticated, isNotAuthenticated } = require("../middleware/guards");
const responseHandler = require("../utils/responseHandler");

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

    const params = {
      res,
      controller: register,
      deps: [firstName, lastName, email, password, role],
      statusCode: 201,
      hasDataTransfer: true,
    };

    await responseHandler(params);
    return;
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

    const params = {
      res,
      controller: login,
      deps: [email, password],
      hasDataTransfer: true,
    };

    await responseHandler(params);
    return;
  }
);

//GET: /auth/logout - User logout
router.get("/logout", isAuthenticated, async (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
