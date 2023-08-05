const express = require("express");
const { body } = require("express-validator");
const {
  updateDetails,
  updatePassword,
} = require("../controllers/accountController");
const { validation } = require("../middleware/validators");
const { rejectResponse } = require("../utils/customError");

const router = express.Router();

//POST: accounts/update-account - Update account

router.put(
  "/update-account",
  body("firstName").isAlpha().optional({ checkFalsy: true }),
  body("lastName").isAlpha().optional({ checkFalsy: true }),
  body("email").isEmail().optional({ checkFalsy: true }),
  body("image").isEmail().optional({ checkFalsy: true }),
  validation(),
  async (req, res) => {
    const { firstName, lastName, email, image, id } = req.body;

    try {
      const result = await updateDetails({
        firstName,
        lastName,
        email,
        image,
        id,
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
  body("oldPass").not().isEmpty(),
  body("newPass").not().isEmpty(),
  validation(),
  async (req, res) => {
    const { oldPass, newPass, id } = req.body;

    try {
      await updatePassword(oldPass, newPass, id);
      res.json({ ok: true, message: "Success" });
    } catch (error) {
      return rejectResponse(res, error);
    }
  }
);

module.exports = router;
