const { Schema, default: mongoose } = require("mongoose");

const profileSchema = new Schema({
  gender: {
    type: String,
    trim:true
  },
  dateOfBirth:{
    type:String,
    trim:true
  },
  about:{
    type:String,
    trim:true
  },
  profession:{
    type:String,
    trim:true
  },
});

module.exports = mongoose.model("Profile",profileSchema);