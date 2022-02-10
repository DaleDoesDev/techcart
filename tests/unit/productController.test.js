const Product = require("../../models/product");
const User = require("../../models/user");
const {
  create,
  list,
  remove,
  update,
  read,
  productsCount,
  listRelated,
  productStar,
} = require("../../controllers/product");
const httpMocks = require("node-mocks-http");
const mockProductData = require("../mock-data/product/product.json");
const mockAllProductsData = require("../mock-data/product/allProducts.json");
const mockUserData = require("../mock-data/user/user.json");

let req, res, mockedList;
let mockSlug = mockProductData.slug;

//before each test is ran
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("Product controller's Create fn", () => {
  beforeEach(() => {
    Product.create = jest.fn();
    req.body = mockProductData;
  });

  it("should have a create method", () => {
    expect(typeof create).toBe("function");
  });

  it("should call Model.create() with req.body", async () => {
    await create(req, res);
    expect(Product.create).toBeCalledWith(req.body);
  });

  it("should return res with code 200 and JSON", async () => {
    Product.create.mockReturnValue(mockProductData);
    await create(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockProductData);
  });

  it("should handle errors", async () => {
    Product.create.mockReturnValue(Promise.reject("Fake error."));
    await create(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Product controller's update fn", () => {
  beforeEach(() => {
    Product.findOneAndUpdate = jest.fn();
    req.body = mockProductData;
    req.params.slug = mockSlug;
  });

  it("should have an update method", () => {
    expect(typeof update).toBe("function");
  });

  it("should call Model.findOneAndUpdate() w. expected selector & updates", async () => {
    await update(req, res);
    expect(Product.findOneAndUpdate).toBeCalledWith(
      { slug: mockSlug }, //selector
      //updates (in this case, it's the same mock data for a new product)
      mockProductData,
      { new: true }
    );
  });

  it("should return res with code 200 and JSON", async () => {
    Product.findOneAndUpdate.mockReturnValue(
      { mockProductData },
      { new: true }
    );
    await update(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(
      { mockProductData },
      { new: true }
    );
  });

  it("should handle errors", async () => {
    Product.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await update(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

//products use a POST req to send data: sort, order, page, count (the last 2 are for pagination)
describe("Product controller's POST List fn", () => {
  beforeEach(() => {
    Product.find = jest.fn(); //spy on this mongoose method
    //the below method's implementation is mocked to remove several mongoose chain methods
    mockedList = jest.fn();
    mockedList.mockImplementation(async () => {
      try {
        let products = await Product.find({});
        res.json(products);
      } catch (err) {
        res
          .status(400)
          .json({ error: `Unable to return products: ${err.message}` });
      }
    });
  });

  it("should have a list fn", () => {
    expect(typeof list).toBe("function");
  });

  it("should call Product.find", async () => {
    await mockedList(req, res);
    expect(Product.find).toBeCalled();
    expect(res.statusCode).toBe(200);
  });

  it("should return 200 statusCode and JSON", async () => {
    Product.find.mockReturnValue(mockAllProductsData);
    await mockedList(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
  });

  it("should handle errors", async () => {
    Product.find.mockReturnValue(Promise.reject("fake error"));
    await mockedList(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Product controller's remove fn", () => {
  beforeEach(() => {
    Product.findOneAndDelete = jest.fn();
  });
  it("should have a remove fn", () => {
    expect(typeof remove).toBe("function");
  });
  it("should call Product.findOneAndDelete", async () => {
    req.params.slug = mockSlug;
    await remove(req, res);
    expect(Product.findOneAndDelete).toBeCalledWith({
      slug: mockSlug,
    });
  });
  it("should return statusCode 200 and deleted JSON", async () => {
    Product.findOneAndDelete.mockReturnValue(mockProductData);
    await remove(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockProductData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Product.findOneAndDelete.mockReturnValue(Promise.reject("fake error"));
    await remove(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Product controller's read fn", () => {
  beforeEach(() => {
    req.params.slug = mockSlug;
    Product.findOne = jest.fn();
    mockedRead = jest.fn();
    //the below's implementation is mocked to remove several mongoose .populate() chains
    mockedRead.mockImplementation(async () => {
      try {
        const found = await Product.findOne({ slug: req.params.slug });
        res.json(found);
      } catch (err) {
        console.log(err);
        res
          .status(400)
          .json({ error: `Unable to find requested product: ${err.message}` });
      }
    });
  });
  it("should have a read fn", () => {
    expect(typeof read).toBe("function");
  });
  it("should call Product.findOne", async () => {
    await mockedRead(req, res);
    expect(Product.findOne).toBeCalledWith({ slug: mockSlug });
  });

  it("should return statusCode 200 and product JSON", async () => {
    Product.findOne.mockReturnValue(mockProductData);
    await mockedRead(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockProductData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Product.findOne.mockReturnValue(Promise.reject("fake error"));
    await mockedRead(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

//the below ensures that the mock data is read and a length is returned
describe("Product controller's productsCount fn", () => {
  beforeEach(() => {
    productsCountMock = jest.fn();
    productsCountMock.mockReturnValue(mockAllProductsData.length);
  });
  it("should have a productsCount fn", () => {
    expect(typeof productsCount).toBe("function");
  });
  it("should return the number of products", async () => {
    const response = productsCountMock();
    expect(response).toBe(2);
  });
});

describe("Product controller's listRelated fn", () => {
  const alteredProductMock = { ...mockProductData, _id: "2345" };

  beforeEach(() => {
    Product.findById = jest.fn();
    Product.find = jest.fn();
    Product.findById.mockReturnValue(alteredProductMock);
    Product.find.mockReturnValue(mockProductData);
    listRelatedMock = jest.fn();
    //the below's implementation is mocked to skip mongoose chain functions
    listRelatedMock.mockImplementation(async () => {
      try {
        const product = await Product.findById(req.params.productId);

        const related = await Product.find({
          _id: { $ne: product._id }, //exclude this individual product
          category: product.category,
        });

        res.json(related);
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: `Unable to find related products with the provided data: ${err.message}`,
        });
      }
    });
    req.params.productId = "2345";
  });
  it("should have a listRelated fn", () => {
    expect(typeof listRelated).toBe("function");
  });
  it("should call Product.findById and Product.find", async () => {
    await listRelatedMock(req, res);
    expect(Product.findById).toBeCalledWith("2345");
    expect(Product.find).toBeCalledWith({
      _id: { $ne: alteredProductMock._id },
      category: alteredProductMock.category,
    });
  });

  it("should return status 200 and JSON", async () => {
    await listRelatedMock(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockProductData);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    Product.findById.mockReturnValue(Promise.reject("fake error"));
    await listRelatedMock(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Product controller's productStar fn", () => {
  const alteredProductMock = { ...mockProductData, _id: "2345" };

  beforeEach(() => {
    Product.findById = jest.fn();
    User.findOne = jest.fn();
    Product.findByIdAndUpdate = jest.fn();
    Product.updateOne = jest.fn();

    Product.findOne = jest.fn();

    Product.findById.mockReturnValue(alteredProductMock);
    User.findOne.mockReturnValue(mockUserData);
    Product.findByIdAndUpdate.mockReturnValue(alteredProductMock);
    //productStarMock = jest.fn();

    req.params.productId = "2345";
    req.user = mockUserData; //append the user
    req.body.star = 3; //append a rating
  });
  it("should have a productStar fn", () => {
    expect(typeof productStar).toBe("function");
  });

  it("calls findById,findOne,findByIdAndUpdate if NOT an updated review", async () => {
    await productStar(req, res);
    expect(Product.findById).toBeCalledWith("2345");
    expect(User.findOne).toBeCalledWith({ email: "test@gmail.com" });
    expect(Product.findByIdAndUpdate).toBeCalledWith(
      "2345",
      {
        $push: { ratings: { star: 3, postedBy: mockUserData._id } },
      },
      { new: true }
    );
  });

  it("returns status 200 and JSON", async () => {
    await productStar(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(alteredProductMock);
  });

  it("calls Product.updateOne if this is an updated user rating", async () => {
    let productWithRating = alteredProductMock;
    let rating = {
      star: 4,
      postedBy: mockUserData._id,
    };
    //add a rating from a mock user
    productWithRating.ratings.push({
      star: 4,
      postedBy: mockUserData._id,
    });
    //now, return this new mock product when searched in productStar
    Product.findById.mockReturnValue(productWithRating);
    Product.updateOne.mockReturnValue(productWithRating);
    let exisitng;
    await productStar(req, res);
    expect(Product.updateOne).toBeCalledWith(
      {
        ratings: { $elemMatch: rating },
      },
      { $set: { "ratings.$.star": 3 } },
      { new: true }
    );
  });
});
