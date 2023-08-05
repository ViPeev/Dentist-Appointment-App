const roles = require("../utils/roles");

const isAdmin = (req, res, next) => {
  const account = req.account;

  if (!account) {
    return res.status(401).json({ ok: false, message: "Not authenticated!" });
  }

  if (Number(account.role) !== roles.ADMIN) {
    return res.status(401).json({ ok: false, message: "Not authorized!" });
  }

  next();
};

const isDentist = (req, res, next) => {
  const account = req.account;

  if (!account) {
    return res.status(401).json({ ok: false, message: "Not authenticated!" });
  }

  if (Number(account.role) !== roles.DENTIST) {
    return res.status(401).json({ ok: false, message: "Not authorized!" });
  }

  next();
};

const isPatient = (req, res, next) => {
  const account = req.account;

  if (!account) {
    return res.status(401).json({ ok: false, message: "Not authenticated!" });
  }

  if (Number(account.role) !== roles.PATIENT) {
    return res.status(401).json({ ok: false, message: "Not authorized!" });
  }

  next();
};

const isAuthenticated = (req, res, next) => {
  const account = req.account;

  if (!account) {
    return res.status(401).json({ ok: false, message: "Not authenticated!" });
  }

  next();
};

module.exports = { isAuthenticated, isAdmin, isDentist, isPatient };
