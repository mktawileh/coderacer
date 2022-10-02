const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;

module.exports = async function (req, res, next) {
  const token = req.cookies.t;
  const gtoken = req.cookies.g;
  if (req.user) {
    res.clearCookie("g");
    return next();
  }
  if (gtoken) {
    try {
      const result = jwt.verify(gtoken, process.env.API_SECRET);
      if (result.id) {
        delete result.iat;
        req.guest = result;
      }
    } catch (err) {}
  }
  if (!req.guest) {
    const guest = {
      id: uuid(),
      username: "guest",
      avatar: "z",
    };
    req.guest = guest;
    const guestToken = jwt.sign(guest, process.env.API_SECRET);
    res.cookie("g", guestToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
    });
  }
  next();
};
