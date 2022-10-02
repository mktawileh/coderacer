const router = require("express").Router();
const User = require("../../models/user");

const { getRecentStatOfUser } = require("../../controllers/stat.controller.js");
// const auth = require("../../middlewares/auth");

// Protected Routes.
// router.use(["/check", "/get"], auth);

// Routes
router.get("/get-rsou", async function (req, res) {
  const { d = 3, username, no_id } = req.query;
  const user = await User.findOne({ username });
  if (user) {
    const result = await getRecentStatOfUser(user._id, d, no_id != "false");
    return res.send({ status: true, message: "Successfull", data: result });
  } else {
    return res.send({ status: false, message: "User not found" });
  }
});

module.exports = ["stat", router];
