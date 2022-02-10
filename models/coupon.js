const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      required: true,
      minlength: 2,
      maxlength: 12,
    },
    expire: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
