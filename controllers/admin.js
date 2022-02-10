const Order = require("../models/order");

module.exports.orders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort("-createdAt")
      .populate({
        path: "products.product",
        populate: {
          path: "brand",
        },
      })
      .populate("orderedBy");
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Unable to get orders: ${err.message}` });
  }
};

module.exports.orderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    let updated = await Order.findByIdAndUpdate(
      orderId, //selector
      { orderStatus },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Order status update failed: ${err.message}` });
  }
};
