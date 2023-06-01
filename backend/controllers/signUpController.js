const otpSchema = require("../models/otpSchema");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const profileModel = require("../models/profileModel");

const signupController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPass,
      phoneNumber,
      accountType,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPass ||
      !phoneNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Fill all required data",
      });
    }

    if (password !== confirmPass) {
      return res.status(403).json({
        success: false,
        message: "Password do not match",
      });
    }

    const userExist = await userModel.findOne({email});

    if (userExist) {
      return res.status(403).json({
        success: false,
        message: "User Already exists",
      });
    }

    const recentOtp = await otpSchema
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log(recentOtp);

    if (!recentOtp || recentOtp[0].otp.length < 6) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    console.log(otp);
    if (otp !== recentOtp[0].otp) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    let approved = "";
    approved === "instructor" ? (approved = false) : (approved = true);

    const additionalDetails = await profileModel.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      profession: null,
    });

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPass,
      accountType,
      phoneNumber,
      approved,
      additionalDetails: additionalDetails._id,
      image: `https://api.dicebear.com/6.x/initials/svg/seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      user: newUser,
      message: "New User created",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error while signing up",
      error,
    });
  }
};

module.exports = signupController;
