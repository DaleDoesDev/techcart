const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

//controllers
const { create, read, update, remove, list } = require("../controllers/brand");

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//endpoints
router.post("/brand", authCheck, adminCheck, body("name").escape(), create);
router.get("/brands", list);
router.get("/brand/:slug", read);
router.put(
  "/brand/:slug",
  authCheck,
  adminCheck,
  body("name").escape(),
  update
);
router.delete("/brand/:slug", authCheck, adminCheck, remove);

module.exports = router;
