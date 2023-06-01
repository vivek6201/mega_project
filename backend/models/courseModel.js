const { Schema, default: mongoose } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  ratingAndReview: [
    {
      type: Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  studentsEnrolled: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  whatYouWillLearn: {
    type: String,
    required: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  categories: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  tags: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  instructions: {
    type: [String],
  },
});

module.exports = mongoose.model("Course", courseSchema);
