const router = require("express").Router();

const {
  add,
  del,
  get,
  getLatest,
  getRecentOfUser,
  getWithCode,
  getCodeScoreBoard,
  getTopRacesLastWeek,
  getRecent,
} = require("../../controllers/race.controller.js");

const auth = require("../../middlewares/auth");

// Protected Routes.
router.use(["/get", "/get-with-code", "/remove", "/get-rou"], auth);

router.post("/add", add);
router.get("/get", get);
router.get("/get-with-code", getWithCode);
router.post("/remove", del);
router.get("/get-rou", getRecentOfUser);
router.get("/get-latest", getLatest);
router.get("/get-csb", getCodeScoreBoard);
router.get("/get-top-lw", getTopRacesLastWeek);
router.get("/get-recent", getRecent);

module.exports = ["race", router];
