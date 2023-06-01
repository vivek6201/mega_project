const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const { instance } = require("../config/razorpay");
const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

const createPayment = async (req, res) => {
  const courseId = req.body;
  const userId = req.user.id;

  if (!courseId || !userId) {
    return res.status(401).json({
      success: false,
      message: "Important fields missing",
    });
  }

  let course;
  try {
    course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not found",
      });
    }

    const uid = new mongoose.Types.ObjectId(userId);

    const alreadyEnrolled = course.studentsEnrolled.includes(uid);

    if (alreadyEnrolled) {
      return res.status(403).json({
        success: false,
        message: "Student Already Enrolled",
      });
    }
  } catch (error) {
    console.error("Error on checking student details while creating payment");
    res.status(500).json({
      success: false,
      message: "Error on checking student details while creating payment",
      error: error.message,
    });
  }

  const amount = course.price;
  const currency = "INR";

  const options = {
    recipt: Math.random(Date.now()).toString(),
    amount: amount * 100,
    currency,
    notes: {
      courseId,
      userId,
    },
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log("payment Response => ", paymentResponse);

    res.status(200).json({
      success: true,
      courseName: course.title,
      courseDesc: course.description,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      message: "Order intiated Successfully",
    });
  } catch (error) {
    console.error("error while intiating order", error);
    res.status(500).json({
      success: false,
      message: "Error while initiating Order",
    });
  }
};

const verifySignature = async (req, res) => {
  const webHookSecret = "01234567";

  const signature = req.headers("x-razorpay-signature");

  const shasum = crypto.createHmac("sha256", webHookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorised");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      const enrolledCourse = await courseModel.findOneAndUpdate(
        { _id: courseId },
        {
          $push: { studentsEnrolled: userId },
        },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "course not found",
        });
      }

      console.log(enrolledCourse);

      //find the student
      const enrollStudent = userModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: { courses: courseId },
        },
        { new: true }
      );

      console.log("Student Enrolled", enrollStudent);

      await mailSender(
        enrollStudent.email,
        "Course Purchased Successfully",
        courseEnrollmentEmail(enrolledCourse.title, enrollStudent.firstName)
      );

      return res.status(200).json({
        success: true,
        message: "Signature verified and Course Added Successfully",
      });
    } catch (error) {
      console.error("Error occurred while verifying signature", error);
      res.status(500).json({
        success: false,
        message: "Error occurred while verifying signature",
        error: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }
};

module.exports = { createPayment, verifySignature };
