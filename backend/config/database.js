const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.DB_URL;

const dbConnect = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB Successfully");
  } catch (error) {
    console.error(error.message);
    console.log("Error while connecting to DB")
  }
};

module.exports = dbConnect;
