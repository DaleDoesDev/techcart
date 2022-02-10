const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

//controllers
const { create, remove, list } = require("../controllers/coupon");

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//endpoints
router.post("/coupon", authCheck, adminCheck, body("name").escape(), create);
router.get("/coupons", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
