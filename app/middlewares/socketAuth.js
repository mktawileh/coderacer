const jwt = require("jsonwebtoken");
const User = require("../models/user");
const parseCookies = require("cookie").parse;

const verifyToken = async (socket, next) => {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  const token = cookies.t;
  const gtoken = cookies.g;
  try {
    if (token) {
      const result = jwt.verify(token, process.env.API_SECRET);
      if (result.id) {
        const user = await User.findById(result.id);
        socket.user = user;
        return next();
      }
    }
    if (gtoken) {
      const guest = jwt.verify(gtoken, process.env.API_SECRET);
      if (guest.id) {
        socket.guest = guest;
        return next();
      }
    }
  } catch (err) {
    return next(err);
  }

  next(new Error("unauthorized"));
};
module.exports = verifyToken;
