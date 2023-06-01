const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Missing",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      console.log(decode);
      
      //check this
      req.user = decode
    } catch (error) {
      console.error("Error while verifying token", error);
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error while authentication",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "student") {
      return res.status(403).json({
        success: false,
        message: "Restricted Route for student",
      });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error while accessing Private route",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Restricted Route for admin",
      });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error while accessing Private route",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Restricted Route for instructor",
      });
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error while accessing Private route",
    });
  }
};
