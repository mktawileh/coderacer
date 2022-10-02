const router = require("express").Router();

const { get, check } = require("../../controllers/track.controller.js");
const auth = require("../../middlewares/auth");

// Protected Routes.
router.use(["/check", "/get"], auth);

// Routes
router.get("/get", get, function (req, res) {});
router.get("/check", check, function (req, res) {});

module.exports = ["track", router];
