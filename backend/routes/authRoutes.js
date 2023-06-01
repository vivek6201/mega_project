const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signUpController");
const loginController = require("../controllers/loginController");
const sendOtp = require("../controllers/sendOtp");
const {
  resetPassTokenGenerator,
  resetPassword,
} = require("../controllers/resetPassController");
const changePassController = require("../controllers/changePassController");
const { auth } = require("../middlewares/authMiddleware");

//Authentication Routes
router.post("/auth/signup", signupController);
router.post("/auth/send-otp", sendOtp);
router.post("/auth/login", loginController);

//Password Routes
router.post("/auth/reset-pass-token", resetPassTokenGenerator);
router.post("/auth/reset-pass", resetPassword);
router.post("/auth/change-pass", auth, changePassController);

module.exports = router;