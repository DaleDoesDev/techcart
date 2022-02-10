const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

module.exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const sub = await Sub.create({ name, parent, slug: slugify(name) });
    res.json(sub);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate subcategory.";
    res
      .status(400)
      .json({ error: `Create subcategory failed: ${err.message}` });
  }
};

module.exports.list = async (req, res) => {
  //find all by newest
  const subcategories = await Sub.find({}).sort({ createdAt: -1 });
  res.json(subcategories);
};

module.exports.read = async (req, res) => {
  let subcategory = await Sub.findOne({ slug: req.params.slug });
  const products = await Product.find({ subs: subcategory });

  res.json({
    sub: subcategory,
    products,
  });
};

module.exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      {
        slug: req.params.slug, //selector
      },
      { name, slug: slugify(name), parent }, //updates
      { new: true } //return the newly modified document
    );
    res.json(updated);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate subcategory information exists.";
    console.log(err);
    res
      .status(400)
      .json({ error: `Subcategory update failed: ${err.message}` });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Subcategory delete failed: ${err.message}` });
  }
};
