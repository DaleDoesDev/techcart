const express = require("express");
const { authCheck } = require("../middlewares/auth");
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
} = require("../controllers/user");
const router = express.Router();
const { body } = require("express-validator");

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, body("address").escape(), saveAddress);

//coupon
router.post(
  "/user/cart/coupon",
  authCheck,
  body("coupon").escape(),
  applyCouponToCart
);
//orders
router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, orders);
//wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;
