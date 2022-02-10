const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true, //searchable with $text query
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 6000,
      text: true, //searchable with $text query
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: Array,
    colors: {
      //what colors are available
      type: Array,
      required: true,
    },
    selectedColor: {
      type: String,
    },
    brand: {
      type: ObjectId,
      ref: "Brand",
      required: true,
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
