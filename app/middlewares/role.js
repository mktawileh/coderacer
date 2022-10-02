const User = require("../models/user");
const verifyToken = require("./authJWT");

const adminChecker = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role == "admin") {
      next();
    } else {
      res.status(403).send({
        message: "Access Forbidden",
      });
    }
  });
};

module.exports = adminChecker;
