const config = require("../config");
const jwt = require("../lib/jsonwebtoken");

exports.authentication = () => async (req, res, next) => {
  const token = req.header("X-Authorization");

  if (token) {
    try {
      const decodedToken = await jwt.verify(token, config.JWT_SECRET);
      req.user = decodedToken;
    } catch (err) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid authorization token" });
    }
  }
  next();
};