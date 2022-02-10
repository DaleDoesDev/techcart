const Category = require("../models/category");
const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

module.exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    res.json(category);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate category.";
    res.status(400).json({ error: `Create category failed: ${err.message}` });
  }
};

module.exports.list = async (req, res) => {
  //find all by newest
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
};

module.exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug });
  const products = await Product.find({ category }).populate("category");

  res.json({
    category,
    products,
  });
};

module.exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      {
        slug: req.params.slug, //selector
      },
      { name, slug: slugify(name) }, //updates
      { new: true } //return the newly modified document
    );
    res.json(updated);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate category information exists.";
    console.log(err);
    res.status(400).json({ error: `Category update failed: ${err.message}` });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: `Category delete failed: ${err.message}` });
  }
};

module.exports.getSubs = async (req, res) => {
  const subs = await Sub.find({ parent: req.params._id });
  res.json(subs);
};
