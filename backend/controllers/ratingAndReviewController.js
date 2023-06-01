const ratingAndReviewModel = require("../models/ratingAndReviewsModel");
const courseModel = require("../models/courseModel");
const { default: mongoose } = require("mongoose");

//create rating
const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    if (!rating || !review || !courseId) {
      return res.status(404).json({
        success: false,
        message: "Required Fields are empty",
      });
    }

    const courseData = await courseModel.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseData) {
      return res.status(400).json({
        success: false,
        message: "Student not enrolled in the course",
      });
    }

    const alreadyReviewed = await ratingAndReviewModel.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(404).json({
        success: false,
        message: "Student has already reviewed",
      });
    }

    const saveRatingAndReview = await ratingAndReviewModel.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    await courseModel.findByIdAndUpdate(
      {
        _id: courseId,
      },
      {
        $push: { ratingAndReview: saveRatingAndReview._id },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Rating and review uploaded successfully",
    });
  } catch (error) {
    console.error("error occurred while uploading rating and review", error);
    res.status(200).json({
      success: false,
      message: "error occurred while uploading rating and review",
      error: error.message,
    });
  }
};

//get Avg rating
const getAvgRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await ratingAndReviewModel.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Avg Rating fetched successfully",
        averageRating: result[0].averageRating,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating found",
      averageRating: 0,
    });
  } catch (error) {
    console.error("error occurred while getting avg rating and review", error);
    res.status(200).json({
      success: false,
      message: "error occurred while getting avg rating and review",
      error: error.message,
    });
  }
};

//get all rating
const getAllRating = async (req, res) => {
  try {
    const allRatingReview = await ratingAndReviewModel
      .find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "title",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All rating reviews fetched",
      allRatingReview,
    });
  } catch (error) {
    console.error("error occurred while getting all rating and reviews", error);
    res.status(200).json({
      success: false,
      message: "error occurred while getting all rating and reviews",
      error: error.message,
    });
  }
}

module.exports = { createRating, getAllRating, getAvgRating };