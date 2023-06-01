const { Schema, default: mongoose } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
