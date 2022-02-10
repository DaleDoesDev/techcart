const Coupon = require("../models/coupon");

module.exports.create = async (req, res) => {
  try {
    const { name, expire, discount } = req.body;
    const coupon = await Coupon.create({ name, expire, discount });
    res.json(coupon);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate coupon.";
    res.status(400).json({ error: `Create coupon failed: ${err.message}` });
  }
};

module.exports.remove = async (req, res) => {
  try {
    let removed = await Coupon.findByIdAndDelete(req.params.couponId);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: `Delete coupon failed: ${err.message}` });
  }
};

module.exports.list = async (req, res) => {
  try {
    let coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Unable to get all coupons: ${err.message}` });
  }
};
