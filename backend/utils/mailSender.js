const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async ( email, title, body ) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "StudyNotion || Codehelp - By LoveBabbar",
      to: email,
      subject: title,
      html: body,
    });

    console.log(info);
    return info;

  } catch (error) {
    console.error(error.message);
    console.log("error while creating transporter");
  }
};

module.exports = mailSender;
