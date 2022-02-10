const mongoose = require("mongoose");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Sub = require("../models/sub");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const Coupon = require("../models/coupon");
const slugify = require("slugify");
const createProducts = require("./createProducts");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //for the .env file hiddle values
}

const dbUrl = process.env.DATABASE;

mongoose
  .connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => {
    console.log("DB CONNECTION ERROR", err);
  });

const createBrands = () => {
  const brands = [
    "MSI",
    "Microsoft",
    "Lenovo",
    "HP",
    "Dell",
    "ASUS",
    "Apple",
    "Alienware",
    "Acer",
  ];
  brands.forEach(async (brand) => {
    await new Brand({ name: brand, slug: slugify(brand) }).save();
  });
};

const createCategoriesAndSubs = async () => {
  //create categories
  const windows = await new Category({
    name: "Windows OS",
    slug: slugify("Windows OS"),
  }).save();

  const mac = await new Category({
    name: "macOS",
    slug: slugify("macOS"),
  }).save();

  await new Category({
    name: "Chrome OS",
    slug: slugify("Chrome OS"),
  }).save();

  //create corresponding subcategories using the above categoy references
  //mac subcategories
  const macSubs = ["Macbook Pro", "Macbook Air"];
  macSubs.forEach(async (macSub) => {
    await new Sub({
      name: macSub,
      parent: mac._id,
      slug: slugify(macSub),
    }).save();
  });
  //windows categories
  const windowsSubs = ["Gaming Laptops", "Business Laptops"];
  windowsSubs.forEach(async (windowSub) => {
    await new Sub({
      name: windowSub,
      parent: windows._id,
      slug: slugify(windowSub),
    }).save();
  });
  //there are no Chrome OS subcategories.
};

const createCoupon = async () => {
  //set a one week expiration for this generated coupon
  let someDate = new Date();
  let numberOfDaysToAdd = 25;
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

  await new Coupon({
    name: "PORTFOLIO",
    expire: someDate,
    discount: "15",
  }).save();
};

const alterDb = async () => {
  //wipe previous data to reformat db (excluding users)
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Brand.deleteMany({});
  await Category.deleteMany({});
  await Sub.deleteMany({});
  await Coupon.deleteMany({});
  await Product.deleteMany({});

  await createCategoriesAndSubs();

  createBrands();
  createCoupon();
  createProducts();
};

alterDb();
