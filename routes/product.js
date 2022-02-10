const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

//controllers
const {
  create,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} = require("../controllers/product");

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//endpoints
router.post(
  "/product",
  authCheck,
  body("title").escape(),
  body("description").escape(),
  create
);
router.get("/products/total", productsCount);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put(
  "/product/:slug",
  authCheck,
  adminCheck,
  body("title").escape(),
  update
);

//a post request is used here for the purpose of passing options inside the req.body
router.post("/products", list);

//rating
router.put("/product/star/:productId", authCheck, productStar);

router.get("/product/related/:productId", listRelated);

//a post request is used here for the purpose of passing options inside the req.body
router.post("/search/filters", searchFilters);

module.exports = router;
