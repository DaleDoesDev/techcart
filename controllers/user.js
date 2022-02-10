const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

//building a cart of user products with additional fields added to the products.
module.exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email }); //email is from firebase
    let cartForThisUser = await Cart.findOne({ orderedBy: user._id });

    if (cartForThisUser) cartForThisUser.remove(); //mongoose method on Cart model

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id; //get the id for each product
      object.count = cart[i].count;
      object.selectedColor = cart[i].selectedColor; //user's chosen color for the product
      let productFromDb = await Product.findById(object.product).select(
        "price"
      );
      object.price = productFromDb.price;

      products.push(object);
    }

    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += products[i].count * products[i].price;
    }

    await Cart.create({
      products,
      cartTotal: total,
      orderedBy: user._id,
    });

    res.json({ ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Unable to save cart: ${err.message}`, ok: false });
  }
};

module.exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }); //email is from firebase

    let cart = await Cart.findOne({ orderedBy: user._id }).populate(
      "products.product", //individual product is nested
      "_id title price totalAfterDiscount selectedColor" //popoulate only selected fields
    );

    if (cart) {
      const { products, cartTotal, totalAfterDiscount } = cart;
      res.json({ products, cartTotal, totalAfterDiscount });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Cannot find cart for current user: ${err.message}` });
  }
};

module.exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }); //email is from firebase
    const cart = await Cart.findOneAndRemove({ orderedBy: user._id });
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `Unable to delete user's cart: ${err.message}`,
      ok: false,
    });
  }
};

module.exports.saveAddress = async (req, res) => {
  try {
    const userAddress = await User.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body }
    );
    res.json({ ok: true, userAddress });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `Unable to save user's address: ${err.message}`,
      ok: false,
    });
  }
};

module.exports.applyCouponToCart = async (req, res) => {
  try {
    const { coupon } = req.body;

    const validCoupon = await Coupon.findOne({ name: coupon });

    if (validCoupon === null) {
      return res.status(400).json({
        error: "Sorry, this is not a valid coupon.",
      });
    }

    const user = await User.findOne({ email: req.user.email });
    let { cartTotal } = await Cart.findOne({
      orderedBy: user._id,
    }).populate(
      "products.product", //individual product is nested
      "_id title price"
    );

    let totalAfterDiscount = Number(
      (cartTotal - (cartTotal * validCoupon.discount) / 100) //integer percent to decimal
        .toFixed(2)
    );

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    );

    res.json(totalAfterDiscount);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `Unable to process coupon: ${err.message}`,
    });
  }
};

module.exports.createOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body.stripeResponse;

    const user = await User.findOne({ email: req.user.email }); //from firebase

    let { products } = await Cart.findOne({ orderedBy: user._id });

    await Order.create({
      products,
      paymentIntent,
      orderedBy: user._id,
    });

    //perform changes to 2 fields on all cart products as a bulkWrite
    let bulkOption = products.map((item) => {
      //products is an arr
      return {
        updateOne: {
          filter: { _id: item.product._id }, //this is the selector
          //'count' is how many were bought in this cart
          update: { $inc: { quantity: -item.count, sold: +item.count } }, //increment operator
        },
      };
    });

    await Product.bulkWrite(bulkOption, {});

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({
      error: `There was a problem saving this order: ${err.message}`,
      ok: false,
    });
  }
};

module.exports.orders = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email }); //from firebase
    let userOrders = await Order.find({ orderedBy: user._id })
      .populate({
        path: "products.product",
        populate: {
          path: "brand",
        },
      })
      .populate("orderedBy");

    res.json(userOrders);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `There was a problem getting this user's orders: ${err.message}`,
    });
  }
};

module.exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: { wishlist: productId } } //$addToSet adds value to arr if it's not already there
    );
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `There was a problem updating the wishlist with this product: ${err.message}`,
      ok: false,
    });
  }
};

module.exports.wishlist = async (req, res) => {
  try {
    const list = await User.findOne({ email: req.user.email })
      .select("wishlist")
      .populate("wishlist");
    res.json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: `There was a problem getting the wishlist: ${err.message}`,
    });
  }
};

module.exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } } //removes instances from an arr
    );
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `There was a problem deleting from the wishlist: ${err.message}`,
      ok: false,
    });
  }
};
