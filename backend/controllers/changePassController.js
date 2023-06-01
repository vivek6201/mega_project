const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

const changePassController = async (req, res) => {
  try {
    const { prevPass, newPass, confirmNewPass } = req.body;
    const userId = req.user.id;

    if (!prevPass || !userId || !newPass || !confirmNewPass) {
      return res.status(403).json({
        success: false,
        message: "Fill All Details",
      });
    }

    const user = await userModel.findById(userId);

    const verifyPass = await bcrypt.compare(prevPass, user.password);

    if (!verifyPass) {
      return res.status(403).json({
        success: false,
        message: "Invalid Password",
      });
    }

    if (newPass !== confirmNewPass) {
      return res.status(403).json({
        success: false,
        message: "Password donot match",
      });
    }

    const hashNew = await bcrypt.hash(newPass, 10);

    await userModel.findByIdAndUpdate(
      userId,
      { password: hashNew },
      { new: true }
    );

    delete user.password;

    try {
      await mailSender(
        user?.email,
        "Password Changed",
        passwordUpdated(
          user?.email,
          `Password updated successfully for ${user?.firstName} ${user?.lastName}`
        )
      );
    } catch (error) {
      console.error("Error while sending Email");
      res.status(500).json({
        success: false,
        message: "Error while sending Email",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "password changed successfully",
      user,
    });
  } catch (error) {
    console.error("Error occured while changing password",error.message);
    res.status(500).json({
      success: false,
      message: "Error while Changing Password",
      error,
    });
  }
};

module.exports = changePassController;
