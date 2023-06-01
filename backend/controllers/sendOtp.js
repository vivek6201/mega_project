const otpSchema = require("../models/otpSchema");
const userSchema = require("../models/userModel");
const genOtp = require("otp-gen-agent");

const setOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await userSchema.findOne({email});

    if (checkUser) {
      return res.status(403).json({
        success: false,
        message: "User already exist, please go to login screen",
      });
    }

    //generate otp

    const generateOtp = await genOtp.otpGen();

    const saveOtp = await otpSchema.create({
      email,
      otp:generateOtp,
    });

    console.log("otp generated",saveOtp);

    res.status(200).json({
      success:true,
      otp:saveOtp,
      message:"Otp generated Successfully"
    })

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success:false,
      message:"Error in generating OTP"
    })
  }
};

module.exports = setOtpController;
