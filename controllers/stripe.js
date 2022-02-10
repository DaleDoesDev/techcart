const User = require("../models/user");
const Cart = require("../models/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports.createPaymentIntent = async (req, res) => {
  try {
    const { appliedCoupon } = req.body;
    const user = await User.findOne({ email: req.user.email }); //from firebase
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: user._id,
    });

    let finalAmount = 0;
    if (appliedCoupon && totalAfterDiscount) {
      finalAmount = (totalAfterDiscount * 100).toFixed(0); //stripe wants the 'amount' in cents
    } else finalAmount = (cartTotal * 100).toFixed(0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Unable to process transaction: ${err.message}` });
  }
};
