const { Schema, default: mongoose } = require("mongoose");

const subSectionSchema = new Schema({
  title:{
    type:String,
    trim:true
  },
  duration:{
    type:String,
  },
  description:{
    type:String,
  },
  videoUrl:{
    type:String,
  },
});

module.exports = mongoose.model("SubSection",subSectionSchema);