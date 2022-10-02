module.exports = [
  function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  },
  function (err, req, res, next) {
    res.status(err.status || 500);

    return res.send({
      status: false,
      message: err.message,
    });
  },
];
