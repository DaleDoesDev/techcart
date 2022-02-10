const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

//controllers
const {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} = require("../controllers/category");

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//endpoints
router.post("/category", authCheck, adminCheck, body("name").escape(), create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put(
  "/category/:slug",
  authCheck,
  adminCheck,
  body("name").escape(),
  update
);
router.delete("/category/:slug", authCheck, adminCheck, remove);
//get all the subcategories for a given parent category
router.get("/category/subs/:_id", getSubs);
module.exports = router;
