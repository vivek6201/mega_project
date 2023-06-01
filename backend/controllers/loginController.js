const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill all details",
      });
    }

    let userExist = await userModel
      .findOne({email})
      .populate("additionalDetails")
      .exec();

    if (!userExist) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const comparePass = await bcrypt.compare(password, userExist.password);

    if (!comparePass) {
      return res.status(403).json({
        success: false,
        message: "Password Do not match",
      });
    }

    const payload = {
      email,
      id: userExist._id,
      accountType: userExist.accountType,
    };
    delete userExist.password;

    //creating token
    const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "3d",
    });

    userExist.token = token;

    const options = {
      expiresIn: "3d",
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User login successfully",
      user: userExist,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while loging in",
      error,
    });
  }
};

module.exports = loginController;
