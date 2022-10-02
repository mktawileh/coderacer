const jwt = require("jsonwebtoken");
User = require("../models/user");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.t;
  if (!req.user) {
    const err = new Error("Access Forbiden");
    err.status = 403;
    next(err);
  } else {
    next();
  }
};
module.exports = verifyToken;
