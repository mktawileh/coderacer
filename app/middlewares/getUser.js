const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getUser = async (req, res, next) => {
  const token = req.cookies.t;
  if (token) {
    try {
      const result = jwt.verify(token, process.env.API_SECRET);
      if (result.id) {
        const user = await User.findById(result.id);
        req.user = user;
      }
    } catch (error) {
      return res.status(500).send({ status: false, error });
    }
  }
  next();
};
module.exports = getUser;
