const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "A name is required.",
      minlength: [2, "The entered name is too short."],
      maxlength: [32, "The entered name is too long."],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
