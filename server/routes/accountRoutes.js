const express = require("express");
const { body } = require("express-validator");
const {
  updateDetails,
  updatePassword,
} = require("../controllers/accountController");
const { validation } = require("../middleware/validators");
const { isAuthenticated } = require("../middleware/guards");
const responseHandler = require("../utils/responseHandler");

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
    
    const params = {
      res,
      controller: updateDetails,
      deps: [
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          image: req.body.image,
          id: req.account.id,
        },
      ],
      message: "Success",
      hasDataTransfer: false,
    };

    await responseHandler(params);
    return;
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

    const params = {
      res,
      controller: updatePassword,
      deps: [oldPass, newPass, accountId],
      message: "Success",
      hasDataTransfer: false,
    };

    await responseHandler(params);
    return;
  }
);

module.exports = router;
