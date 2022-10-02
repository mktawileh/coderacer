const router = require("express").Router();

const {
  add,
  update,
  del,
  get,
  getAll,
  getRandomCodes,
} = require("../../controllers/code.controller.js");

const auth = require("../../middlewares/auth");

// Protected Routes.
router.use(["/add/", "/update", "/delete", "/get", "/get-all"], auth);

// Routes
router.post("/add", add);
router.post("/update", update);
router.post("/delete", del);
router.get("/get", get);
router.get("/get-all", getAll);
router.get("/grc", getRandomCodes);

module.exports = ["code", router];
