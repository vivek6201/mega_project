const { Schema, default: mongoose } = require("mongoose");

const sectionSchema = new Schema({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchema);
