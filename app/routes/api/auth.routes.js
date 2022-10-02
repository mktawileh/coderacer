const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");
const guestOnlyMiddleware = require("../../middlewares/guestOnly");

const {
  register,
  login,
  logout,
  isAuth,
} = require("../../controllers/auth.controller.js");

// Protected routes
// router.use(["/check"], authMiddleware);
router.use(["/login", "/register"], guestOnlyMiddleware);

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", isAuth);

module.exports = ["auth", router];
