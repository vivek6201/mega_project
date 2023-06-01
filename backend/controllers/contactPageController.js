const userModel = require("../models/userModel");
const mailSender = require("../utils/mailSender");
const contactQueryEmail = require("../mail/templates/contactQueryEmail");
require("dotenv").config();

const sendContactDetails = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !message) {
    return res.status(403).json({
      success: false,
      message: "Fill all details",
    });
  }

  await mailSender(email, "Response Recorded", contactQueryEmail(firstName));
  await mailSender(process.env.MAIL_USER, "Query from Student", {
    firstName: `First name:  ${firstName}`,
    lastName:`Last name:  ${lastName}`,
    email: `email:  ${email}`,
    phoneNumber: `Phone number:  ${phoneNumber}`,
    message:`Message:  ${message}`,
  });
};

module.exports = sendContactDetails;
