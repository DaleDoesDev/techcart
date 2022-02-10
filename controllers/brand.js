const Brand = require("../models/brand");
const Product = require("../models/product");
const slugify = require("slugify");

module.exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.json(brand);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate category.";
    res.status(400).json({ error: `Create brand failed: ${err.message}` });
  }
};

module.exports.list = async (req, res) => {
  //find all by newest
  try {
    const brands = await Brand.find({}).sort({ createdAt: -1 });
    res.json(brands);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Unable to get all brands: ${err.message}` });
  }
};

module.exports.read = async (req, res) => {
  try {
    let brand = await Brand.findOne({ slug: req.params.slug });
    const products = await Product.find({ brand }).populate("brand");

    res.json({
      brand,
      products,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Unable to find requested brand: ${err.message}` });
  }
};

module.exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Brand.findOneAndUpdate(
      {
        slug: req.params.slug, //selector
      },
      { name, slug: slugify(name) }, //updates
      { new: true } //return the newly modified document
    );
    res.json(updated);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate brand information exists.";
    console.log(err);
    res.status(400).json({ error: `Brand update failed: ${err.message}` });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const deleted = await Brand.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: `Brand delete failed: ${err.message}` });
  }
};
