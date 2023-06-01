const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const courseModel = require("../models/courseModel");
const { fileUploadCloudinary } = require("../utils/fileUploadCloudinary");
require("dotenv").config();

const createCourse = async (req, res) => {
  //fetch user id
  const userId = req.user.id;

  try {
    let {
      title,
      description,
      price,
      category,
      tag,
      whatYouWillLearn,
      status,
      instructions,
    } = req.body;
    const { thumbnail } = req.files;

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !whatYouWillLearn ||
      !thumbnail ||
      !tag
    ) {
      return res.status(404).json({
        success: false,
        message: "Fill All details",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    //check instructor

    //todo: verify that user.id and instructorData is same or not
    const instructorData = await userModel.findById(userId, {
      accountType: "instructor",
    });

    console.log("Instructor data", instructorData);

    if (!instructorData) {
      return res.status(404).json({
        success: false,
        message: "Instructor id not present",
      });
    }

    const categoryDetails = await categoryModel.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid Category",
      });
    }

    const thumbnailImage = await fileUploadCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await courseModel.create({
      title,
      description,
      instructor: instructorData._id,
      whatYouWillLearn,
      price,
      tags: tag,
      categories: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    const categoryUpdate = await categoryModel.findByIdAndUpdate(
      categoryDetails._id,
      {
        $push: { course: newCourse._id },
      },
      { new: true }
    );
    console.log(categoryUpdate);

    //add new course to user schema
    await userModel.findByIdAndUpdate(
      instructorData._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error while creating course", error);
    res.status(500).json({
      success: false,
      message: `Error occurred with message: ${error.message}`,
    });
  }
};

const showAllCourses = async (req, res) => {
  try {
    //Todo: change below statement incremently
    const allCourses = await courseModel.find({}).populate("instructor").exec();

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      courses: allCourses,
    });
  } catch (error) {
    console.error("Error while fetching course", error);
    res.status(500).json({
      success: false,
      message: `Error occurred with message: ${error.message}`,
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const {courseId} = req.params;

    const courseData = await courseModel
      .findById(courseId)
      .populate("ratingAndReview")
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("categories")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseData) {
      return res.status(400).json({
        success: false,
        message: `could not fetch course with ${courseId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `course details fetched successfully`,
      course: courseData,
    });
  } catch (error) {
    console.error("Error while fetching course", error);
    res.status(500).json({
      success: false,
      message: `Error occurred with message: ${error.message}`,
    });
  }
};

module.exports = { createCourse, showAllCourses, getCourseDetails };
