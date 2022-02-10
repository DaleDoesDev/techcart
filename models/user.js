const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "subscriber",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: Object,
    wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true } //auto-populate date info (createdAt, updatedAt)
);

module.exports = mongoose.model("User", userSchema);
