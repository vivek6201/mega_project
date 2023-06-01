const userModel = require("../models/userModel");
const profileModel = require("../models/profileModel");
const courseModel = require("../models/courseModel");
const { fileUploadCloudinary } = require("../utils/fileUploadCloudinary");
require("dotenv").config();

const updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, profession } = req.body;
    const userId = req.user.id;

    if (!gender || !dateOfBirth || !profession || !about || !userId) {
      return res.status(403).json({
        success: false,
        message: "Fill all details",
      });
    }

    const userData = await userModel.findById(userId);

    const saveProfile = await profileModel.findByIdAndUpdate(
      userData.additionalDetails,
      {
        gender,
        dateOfBirth,
        about,
        profession,
      },
      { new: true }
    );

    console.log(saveProfile);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Profile updation failed",
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Delete Profile related to user
    await profileModel.findByIdAndDelete(user.additionalDetails);

    //Todo: check if this logic works for updating students enrolled
    user.courses.forEach(async (id) => {
      await courseModel.findByIdAndUpdate(
        id,
        { $pull: { studentsEnrolled: userId } },
        { new: true }
      );
    });

    // Delete user
    await userModel.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Profile deletion failed",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .populate("additionalDetails")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: false,
      message: "User details fetched Successfully",
      userData: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "user details fetching failed",
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    console.log(req.files);
    const { profilePicture } = req.files;

    const userId = req.user.id;
    console.log("user id-> ", userId);

    const imageData = await fileUploadCloudinary(
      profilePicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    if (!imageData) {
      return res.status(401).json({
        success: false,
        message: "File upload failed",

      });
    }

    console.log("image data ->", imageData);
    const updateProfile = await userModel.findByIdAndUpdate(
      userId,
      {
        image: imageData.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile Picture updated Successfully",
      user:updateProfile
    });
  } catch (error) {
    console.error("error while changing profile picture", error);
    res.status(500).json({
      success: false,
      message: "error while changing profile picture",
      error: error.message,
    });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel
      .findById(userId)
      .populate("courses")
      .exec();

    if (!userData) {
      return req.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userData.courses,
    });
  } catch (error) {
    console.error("error while fetching enrolled courses");
    res.status(500).json({
      success: false,
      message: "error while fetching enrolled courses",
      error: error.message,
    });
  }
};

module.exports = {
  updateProfile,
  deleteAccount,
  getUserDetails,
  updateProfilePicture,
  getEnrolledCourses,
};
