const express = require("express");
const { body } = require("express-validator");
const {
  updateDetails,
  updatePassword,
} = require("../controllers/accountController");
const { validation } = require("../middleware/validators");
const { rejectResponse } = require("../utils/customError");
const { isAuthenticated } = require("../middleware/guards");

const router = express.Router();

//POST: accounts/update-account - Update account

router.put(
  "/update-account",
  isAuthenticated,
  body("firstName").isAlpha().optional({ checkFalsy: true }),
  body("lastName").isAlpha().optional({ checkFalsy: true }),
  body("email").isEmail().optional({ checkFalsy: true }),
  body("image").isEmail().optional({ checkFalsy: true }),
  validation(),
  async (req, res) => {
    const { firstName, lastName, email, image } = req.body;
    const accountId = req.account.id;

    try {
      const result = await updateDetails({
        firstName,
        lastName,
        email,
        image,
        id: accountId,
      });
      res.json({ ok: true, result, message: "Success" });
    } catch (error) {
      return rejectResponse(res, error);
    }
  }
);

/**
 * PUT accounts/change-password - Change account password
 */
router.put(
  "/change-password",
  isAuthenticated,
  body("oldPass").not().isEmpty(),
  body("newPass").not().isEmpty(),
  validation(),
  async (req, res) => {
    const { oldPass, newPass } = req.body;
    const accountId = req.account.id;

    try {
      await updatePassword(oldPass, newPass, accountId);
      res.json({ ok: true, message: "Success" });
    } catch (error) {
      return rejectResponse(res, error);
    }
  }
);

module.exports = router;
