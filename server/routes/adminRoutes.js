const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../middleware/validators");
const responseHandler = require("../utils/responseHandler");
const {
  toggleSuspend,
  changePassword,
  deleteAdmin,
  getAllAccounts,
  getAccountData,
  getAdmins,
  register,
} = require("../controllers/adminController");

const router = express.Router();

//get all admin accounts by admin
router.get("/", async (req, res) => {
  const accountId = req.account.id;

  const params = {
    res,
    controller: getAdmins,
    deps: [accountId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

// post /admins - Creates new admin
router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ ok: false, message: "Invalid request!" });
  }

  const params = {
    res,
    controller: register,
    deps: [firstName, lastName, email, password],
    statusCode:201,
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

//  patch /admins - Changes admin password
//  If no adminId is present admin changes its own password
//  If adminId present, oldPassword is not required
router.patch("/", async (req, res) => {
  const accountId = req.account.id;
  const { adminId, newPassword, oldPassword } = req.body;

  const params = {
    res,
    controller: changePassword,
    deps: [accountId, adminId, newPassword, oldPassword],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Password changed successfully!",
  };

  await responseHandler(params);
  return;
});

// DELETE admin account
router.delete("/:adminId", async (req, res) => {
  const { adminId } = req.params;

  const params = {
    res,
    controller: deleteAdmin,
    deps: [adminId],
    statusCode: 202,
    hasDataTransfer: false,
    message: "Administrator account has been deleted successfully!",
  };

  await responseHandler(params);
  return;
});

//get all acounts
router.get("/accounts/:limit?", async (req, res) => {
  const limit = parseInt(req.query.limit) || 1000;

  const params = {
    res,
    controller: getAllAccounts,
    deps: [limit],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

// Gets all information about an account with given id
router.get("/account/:accountId", async (req, res) => {
  const { accountId } = req.params;

  const params = {
    res,
    controller: getAccountData,
    deps: [accountId],
    hasDataTransfer: true,
  };

  await responseHandler(params);
  return;
});

// POST /admins/accounts/suspend - Suspend account
router.post(
  "/accounts/suspend",
  body("accountId").isNumeric(),
  validation(),
  async (req, res) => {
    const { accountId } = req.body;

    const params = {
      res,
      controller: toggleSuspend,
      deps: [accountId, "Suspended"],
      statusCode: 202,
      hasDataTransfer: false,
      message: "Account successfully suspended!",
    };

    await responseHandler(params);
    return;
  }
);

// POST /admins/accounts/suspend - Unsuspend account
router.post(
  "/accounts/unsuspend",
  body("accountId").isNumeric(),
  validation(),
  async (req, res) => {
    const { accountId } = req.body;

    const params = {
      res,
      controller: toggleSuspend,
      deps: [accountId, "Active"],
      statusCode: 202,
      hasDataTransfer: false,
      message: "Account successfully unsuspended!",
    };

    await responseHandler(params);
    return;
  }
);

module.exports = router;
