const express = require("express");
const router = express.Router();

const { auth, isStudent } = require("../middlewares/authMiddleware");

const {
  updateProfile,
  deleteAccount,
  getUserDetails,
  updateProfilePicture,
  getEnrolledCourses,
} = require("../controllers/profileController");

//profile routes
router.delete("/user/deleteAccount", auth, isStudent, deleteAccount);
router.put("/user/updateProfile", auth, updateProfile);
router.get("/user/getUserDetails", auth, getUserDetails);
router.put("/user/updateProfilePicture", auth, updateProfilePicture);
router.get("/user/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
