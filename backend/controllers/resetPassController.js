const userModel = require("../models/userModel");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const resetPassTokenGenerator = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email id not found",
      });
    }

    const checkUser = await userModel.findOne({ email });

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomUUID();

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        token: token,
        tokenExpiry: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `http://localhost:3000/resetPass/${token}`;
    console.log("Password Reset Link ", url);

    try {
      await mailSender(
        email,
        "Password Reset Link",
        `Password Reset Link : <a href=${url}>Click Here</a>`
      );
    } catch (error) {
      console.error("Error while sending reset pass email", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while sending email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    console.error("Error while generating reset link", error),
      res.status(500).json({
        success: false,
        message: "Something went wrong while generating link",
      });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPass, confirmNewPass } = req.body;
    console.log(token);

    if (!newPass || !confirmNewPass) {
      return res.status(404).json({
        success: false,
        message: "fill all fields",
      });
    }

    if (newPass !== confirmNewPass) {
      return res.status(401).json({
        success: false,
        message: "Both passwords do not match",
      });
    }

    const userData = await userModel.findOne({ token: token });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Token Did not found",
      });
    }

    if (!(userData.tokenExpiry > Date.now())) {
      return res.status(403).json({
        success: false,
        message: "Link Expired! please regenerate Link",
      });
    }

    console.log(userData);

    const hashedPass = await bcrypt.hash(newPass, 10);

    await userModel.findByIdAndUpdate(
      userData._id,
      {
        password: hashedPass,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password Reset Completed",
    });
  } catch (error) {
    console.error("Error while resetting password", error),
      res.status(500).json({
        success: false,
        message: "Something went wrong while Resting Pass",
      });
  }
};

module.exports = { resetPassTokenGenerator, resetPassword };
