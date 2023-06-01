const { Schema, default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 1000 * 60,
  },
  otp: {
    type: Number,
    required: true,
  },
});

//TODO: check that arrow function can work or not
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      emailTemplate(otp)
    );
    console.log("Mail Sent Successfully", mailResponse);
  } catch (error) {
    console.error("error while send Verification emails: ", error.message);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New Document Saved to Database");

  if(this.isNew){
    await sendVerificationEmail(this.email,this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
