const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: Number,
        selectedColor: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: {
        values: [
          "Not Processed",
          "Processing",
          "Dispatched",
          "Cancelled",
          "Completed",
        ],
        message: "'{VALUE}' is not a currently supported order status",
      },
    },
    orderedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
