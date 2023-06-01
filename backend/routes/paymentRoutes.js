const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifySignature,
} = require("../controllers/paymentController");

const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/authMiddleware");

//payment routes

router.post("/payment/createPayment", auth, isStudent, createPayment);
router.post("/payment/verifySignature", verifySignature);

module.exports = router;