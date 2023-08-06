const roles = require("../utils/roles");

const authAs = (role) => (req, res, next) => {
  const account = req.account;

  if (!account) {
    return res.status(401).json({ ok: false, message: "Not authenticated!" });
  }

  if (Number(account.role) !== roles[role]) {
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

const isNotAuthenticated = (req, res, next) => {
  const account = req.account;

  if (account) {
    return res
      .status(400)
      .json({ ok: false, message: "Already authenticated! Please log-out." });
  }

  next();
};

module.exports = { isAuthenticated, isNotAuthenticated, authAs };
