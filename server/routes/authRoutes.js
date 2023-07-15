const express = require("express");
const { body} = require("express-validator");
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
      return res.status(500).send({ ok: false, message: 'Internal server error!' });
    }
  }
);

//POST: /auth/login - User login

router.post(
  "/login",
  body("email").isEmail(),
  validation(),
  async (req,res) => {
    const { email,password } = req.body;

    try {
      const result = await login(email, password);
      res.json({ ok: true, userData: result });
    } catch (error) {
      return res.status(500).send({ ok: false, message: 'Internal server error!' });
    }
  }
);

/**
 * GET /profile - Authenticate account
 */
router.get("/profile", auth.asAll, accountController.getAccountDetails);

/**
 * PUT accounts/update-account - Update dentist account details with auth and validation
 */
// router.put(
//   "/update-account",
//   check("firstName").isAlpha().optional({ checkFalsy: true }),
//   check("lastName").isAlpha().optional({ checkFalsy: true }),
//   check("email").isEmail().optional({ checkFalsy: true }),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         errors: errors.array(),
//       });
//     }
//     next();
//   },
//   auth.asAll,
//   accountController.updateAccount
// );

// /**
//  * PUT accounts/change-password - Change account password
//  */
// router.put(
//   "/change-password",
//   body("oldPass").not().isEmpty(),
//   body("newPass").not().isEmpty(),
//   body("confirmPass").not().isEmpty(),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         errors: errors.array(),
//       });
//     }
//     next();
//   },
//   auth.asAll,
//   accountController.changePassword
// );

module.exports = router;
