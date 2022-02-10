const mongoose = require("mongoose");
const category = require("./category");
const { ObjectId } = mongoose.Schema

const subSchema = new mongoose.Schema(
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
    parent: {type: ObjectId, ref: "Category", required: true} 
    //subcategories have parent categories
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sub", subSchema);
