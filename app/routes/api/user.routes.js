const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");
const Race = require("../../models/race");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const {
  updateInfo,
  getInfo,
  setAvatar,
  getTopRacers,
  updatePassword,
} = require("../../controllers/user.controller.js");
const User = require("../../models/user");

router.use(["/set-avatar", "/update-info", "/update-pwd"], authMiddleware);

router.post("/set-avatar", setAvatar);
router.post("/update-info", updateInfo);
router.post("/update-pwd", updatePassword);
router.get("/user-info", getInfo);
router.get("/get-top", getTopRacers);

// router.get("/test", async function (req, res) {
//   const user = await User.findById("63198f0bbc8e56916c0d57fb");
//   console.log(user.save);
//   user.username = "fofo";

//   return res.send(await user.save());
// });

module.exports = router;
