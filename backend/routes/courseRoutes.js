const express = require("express");
const router = express.Router();

const {
  createCategory,
  fetchAllCategories,
  categoryPageDetails,
} = require("../controllers/categoryController");

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/courseController");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSectionController");

const {
  createRating,
  getAllRating,
  getAvgRating,
} = require("../controllers/ratingAndReviewController");

const {
  auth,
  isStudent,
  isAdmin,
  isInstructor,
} = require("../middlewares/authMiddleware");

//course routes
router.post("/courses/createCourse", auth, isInstructor, createCourse);
router.get("/courses/showAllCourses", showAllCourses);
router.get("/courses/getCourseDetails/:courseId", getCourseDetails);
router.post("/courses/createSection", auth, isInstructor, createSection);
router.put("/courses/updateSection", auth, isInstructor, updateSection);
router.delete("/courses/:courseId/deleteSection", auth, isInstructor, deleteSection);
router.post("/courses/createSubSection", auth, isInstructor, createSubSection);
router.put("/courses/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/courses/:sectionId/deleteSubSection", auth, isInstructor, deleteSubSection);

//category routes
router.post("/category/createCategory", auth, isAdmin, createCategory);
router.get("/category/fetchAllCategories", fetchAllCategories);
router.post("/category/categoryPageDetails", categoryPageDetails);

//Rating and review
router.post("/ratings/createRating", auth, isStudent, createRating);
router.get("/ratings/getAllRatings", getAllRating);
router.get("/ratings/getAverageRating", getAvgRating);

module.exports = router;
