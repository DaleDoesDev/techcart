const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

module.exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title); //affix slug to the body
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate product.";
    res.status(400).json({ error: `Create product failed: ${err.message}` });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const removed = await Product.findOneAndDelete({ slug: req.params.slug });
    res.json(removed);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: `Delete product failed: ${err.message}` });
  }
};

module.exports.read = async (req, res) => {
  try {
    const found = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("brand")
      .populate("subs");
    res.json(found);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Unable to find requested product: ${err.message}` });
  }
};

module.exports.update = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title); //affix slug to the body
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug }, //the original slug for this product from the put request
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000)
      err.message = "Duplicate product.";
    console.log(err);
    res.status(400).json({ error: `Update product failed: ${err.message}` });
  }
};

module.exports.list = async (req, res) => {
  try {
    // Example input: createdAt/updatedAt, desc/asc, 3
    const { sort, order, page, count } = req.body;
    //count will be 3 or 6

    const pageNumber = page || 1;
    const skips = (pageNumber - 1) * count; //products per page

    const products = await Product.find({})
      .skip(skips)
      .populate("category")
      .populate("subs")
      .populate("brand")
      .sort([[sort, order]])
      .limit(count);

    res.json(products);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: `Unable to return products: ${err.message}` });
  }
};

module.exports.productsCount = async (req, res) => {
  try {
    let total = await Product.find({}).estimatedDocumentCount();
    res.json(total);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: `Unable to determine product count: ${err.message}` });
  }
};

module.exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    //user, below, is added to the req object by firebase
    const user = await User.findOne({ email: req.user.email });
    const { star } = req.body;

    //array method find() is used below on the ratings array of objects
    //check if the user has left a rating before for this product:
    let existingRatingObject = product.ratings.find(
      (el) => el.postedBy.toString() === user._id.toString() //return a match, if any
    );

    //if no match from the above find()
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      );
      res.json(ratingAdded);
    } else {
      const ratingUpdated = await Product.updateOne(
        {
          //find this user's specific rating object in the product's ratings array:
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      );
      res.json(ratingUpdated);
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: `Unable to process product rate: ${err.message}` });
  }
};

//get products that share a category with a given product
module.exports.listRelated = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    const related = await Product.find({
      _id: { $ne: product._id }, //exclude this individual product
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("subs")
      .populate("brand");

    res.json(related);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: `Unable to find related products with the provided data: ${err.message}`,
    });
  }
};

//searching/filtering helpers below (they're only exported for test purposes)

//'price' is an array of 2 prices representing a price range
handlePrice = async (req, res, price, page) => {
  const pageNumber = page || 1;
  const skips = (pageNumber - 1) * 6; //6 products per page

  let products = await Product.find({
    price: {
      $gte: price[0],
      $lte: price[1],
    },
  })
    .skip(skips)
    .populate("category")
    .populate("subs")
    .populate("brand");
  res.json(products);
};

handleCategory = async (req, res, category, page) => {
  try {
    const pageNumber = page || 1;
    const skips = (pageNumber - 1) * 6; //6 products per page

    let products = await Product.find({ category })
      .skip(skips)
      .populate("category")
      .populate("subs")
      .populate("brand");
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Unable to get products: ${err.message}` });
  }
};

//text query
handleQuery = async (req, res, query, page) => {
  const pageNumber = page || 1;
  const skips = (pageNumber - 1) * 6; //6 products per page

  const products = await Product.find({
    //attempt a simple text index search 1st, before attempting a regex match on the slug index
    $or: [{ $text: { $search: query } }, { slug: { $regex: query } }],
    //$or to allow queries with separate indexes
  })
    .skip(skips)
    .populate("category")
    .populate("subs")
    .populate("brand");
  res.json(products);
};

handleStar = async (req, res, stars, page) => {
  const pageNumber = page || 1;
  const skips = (pageNumber - 1) * 6; //6 products per page

  const aggregates = await Product.aggregate([
    //groups all of the Product documents
    {
      //define a project with a computed field, to later match with
      $project: {
        //select what fields should be returned, including computed fields
        document: "$$ROOT", //copy all information from the Product model to start with
        floorAverage: {
          //append a new, computed field to this document
          //calculate and floor an average of all the star rating values on this Product
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } }, //'stars' is one of this fn's args
  ]);
  //return any product that was placed in this aggregate
  const products = await Product.find({ _id: aggregates })
    .skip(skips)
    .populate("category")
    .populate("subs")
    .populate("brand");
  res.json(products);
};

handleSub = async (req, res, sub, page) => {
  const pageNumber = page || 1;
  const skips = (pageNumber - 1) * 6; //6 products per page

  const products = await Product.find({ subs: sub })
    .skip(skips)
    .populate("category")
    .populate("subs")
    .populate("brand");
  res.json(products);
};

handleColor = async (req, res, color, page) => {
  const pageNumber = page || 1;
  const skips = (pageNumber - 1) * 6; //6 products per page

  const products = await Product.find({ colors: { $in: [color] } })
    .skip(skips)
    .populate("category")
    .populate("subs")
    .populate("brand");
  res.json(products);
};

handleBrand = async (req, res, brand, page) => {
  const pageNumber = page || 1;
  const skips = (pageNumber - 1) * 6; //6 products per page

  const products = await Product.find({ brand })
    .skip(skips)
    .populate("category")
    .populate("subs")
    .populate("brand");
  res.json(products);
};

module.exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, sub, color, brand, page } = req.body;
  try {
    if (query) {
      await handleQuery(req, res, query, page);
    }

    //price will be an array representing a price range
    if (price) {
      await handlePrice(req, res, price, page);
    }

    if (category) {
      await handleCategory(req, res, category, page);
    }

    if (stars) {
      await handleStar(req, res, stars, page);
    }

    if (sub) {
      await handleSub(req, res, sub, page);
    }

    if (color) {
      await handleColor(req, res, color, page);
    }

    if (brand) {
      await handleBrand(req, res, brand, page);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Unable to get products: ${err.message}` });
  }
};
