const { Schema, default: mongoose } = require("mongoose");

const ratingAndReviewSchema = new Schema({
  rating:{
    type:String
  },
  review:{
    type:String
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  course:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"Course",
    index:true
  }
});

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);