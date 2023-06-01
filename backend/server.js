const express = require("express");
const app = express();
require("dotenv").config();

//fetch routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

//fetch Libraries
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const expressFileUpload = require("express-fileupload");
const port = process.env.PORT;

//apply middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//mount routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", courseRoutes);

//connect database and cloudinary
cloudinaryConnect();
dbConnect();

//listen to server
app.listen(port, () => {
  console.log(`Server started running on port -> ${port}`);
});
