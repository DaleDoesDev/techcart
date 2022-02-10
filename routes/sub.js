const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

//controllers
const { create, read, update, remove, list } = require("../controllers/sub");

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//endpoints
router.post("/sub", authCheck, adminCheck, body("name").escape(), create);
router.get("/subs", list);
router.get("/sub/:slug", read);
router.put("/sub/:slug", authCheck, adminCheck, body("name").escape(), update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);

module.exports = router;
