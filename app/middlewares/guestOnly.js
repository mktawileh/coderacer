module.exports = async (req, res, next) => {
  const token = req.cookies.t;
  if (req.user || token) {
    const err = new Error("Access Forbiden");
    err.status = 403;
    next(err);
  } else {
    next();
  }
};
