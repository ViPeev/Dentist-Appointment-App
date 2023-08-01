const express = require("express");
const { body } = require("express-validator");
const { validation } = require("../middleware/validators");
const {
  suspendAccount,
  unsuspendAccount,
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

  try {
    const result = await getAdmins(accountId);
    res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error!" });
  }
});

//POST /admins - Creates new admin
router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ ok: false, message: "Invalid request!" });
  }

  try {
    const result = await register(firstName, lastName, email, password);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error!" });
  }
});

//  PATCH /admins - Changes admin password
//  If no adminId is present admin changes its own password
//  If adminId present, oldPassword is not required
router.patch("/", async (req, res) => {
  const accountId = req.account.id;
  const { adminId, newPassword, oldPassword } = req.body;

  try {
    await changePassword(accountId, adminId, newPassword, oldPassword);
    return res
      .status(202)
      .json({ ok: true, message: "Password changed successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error!" });
  }
});

// DELETE admin account
router.delete("/:adminId", async (req, res) => {
  const { adminId } = req.params;

  try {
    await deleteAdmin(adminId);
    return res.status(202).json({
      ok: true,
      message: "Administrator account has been deleted successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error!" });
  }
});

//get all acounts
router.get("/accounts/:limit?", async (req, res) => {
  const limit = parseInt(req.query.limit) || 1000;

  try {
    const result = await getAllAccounts(limit);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error!" });
  }
});

// Gets all information about an account with given id
router.get("/account/:accountId", async (req, res) => {
  const { accountId } = req.params;

  try {
    const result = await getAccountData(accountId);
    return res.json({ ok: true, result });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error!" });
  }
});

// POST /admins/accounts/suspend - Suspend account
router.post(
  "/accounts/suspend",
  body("accountId").isNumeric(),
  validation(),
  async (req, res) => {
    const { accountId } = req.body;

    try {
      await suspendAccount(accountId);
      return res.json({ ok: true, message: "Account successfully suspended!" });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: "Internal server error!" });
    }
  }
);

// POST /admins/accounts/suspend - Unsuspend account
router.post(
  "/accounts/unsuspend",
  body("accountId").isNumeric(),
  validation(),
  async (req, res) => {
    const { accountId } = req.body;

    try {
      await unsuspendAccount(accountId);
      return res.json({
        ok: true,
        message: "Account successfully unsuspended!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: "Internal server error!" });
    }
  }
);

module.exports = router;
