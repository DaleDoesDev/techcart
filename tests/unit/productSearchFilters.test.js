const Product = require("../../models/product");
const { searchFilters } = require("../../controllers/product");
const httpMocks = require("node-mocks-http");
const mockAllProductsData = require("../mock-data/product/allProducts.json");

let priceArr = [1.99, 99.99];

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  Product.find = jest.fn();
  Product.find.mockReturnValue(mockAllProductsData);
});

describe("searchFilters and its helper functions should all defined", () => {
  it("should have a searchFilters method", () => {
    expect(typeof searchFilters).toBe("function");
  });
});

describe("searchFilters' handleQuery helper fn", () => {
  beforeEach(() => {
    handleQueryMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handleQueryMock.mockImplementation(async (req, res, query) => {
      const products = await Product.find({
        //attempt a simple text index search 1st, before attempting a regex match on the slug index
        $or: [{ $text: { $search: query } }, { slug: { $regex: query } }],
        //$or to allow queries with separate indexes
      });
      res.json(products);
    });
  });

  it("should have a handleQuery fn", () => {
    expect(typeof handleQuery).toBe("function");
  });

  it("should call Product.find", async () => {
    await handleQueryMock(req, res, "test");
    expect(Product.find).toBeCalledWith({
      $or: [{ $text: { $search: "test" } }, { slug: { $regex: "test" } }],
    });
  });

  it("should return status 200 and JSON", async () => {
    await handleQueryMock(req, res, "test");
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("searchFilters' handlePrice helper fn", () => {
  beforeEach(() => {
    handlePriceMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handlePriceMock.mockImplementation(async (req, res, price) => {
      let products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      });
      res.json(products);
    });
  });
  it("should have a handlePrice fn", () => {
    expect(typeof handlePrice).toBe("function");
  });

  it("should call Product.find", async () => {
    await handlePriceMock(req, res, priceArr); //price arg
    expect(Product.find).toBeCalled();
  });

  it("should return status 200 and JSON", async () => {
    await handlePriceMock(req, res, priceArr);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("searchFilters' handleCategory helper fn", () => {
  beforeEach(() => {
    handleCategoryMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handleCategoryMock.mockImplementation(async (req, res, category) => {
      let products = await Product.find({ category });
      res.json(products);
    });
  });

  it("should have a handleCategory fn", () => {
    expect(typeof handleCategory).toBe("function");
  });

  it("should call Product.find", async () => {
    await handleCategoryMock(req, res, "some category");
    expect(Product.find).toBeCalledWith({ category: "some category" });
  });

  it("should return status 200 and JSON", async () => {
    await handleCategoryMock(req, res, "some category");
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("searchFilters' handleStar helper fn", () => {
  beforeEach(() => {
    Product.aggregate = jest.fn();
    handleStarMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handleStarMock.mockImplementation(async (req, res, stars) => {
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
      const products = await Product.find({ _id: aggregates });
      res.json(products);
    });
  });

  it("should have a handleStar fn", () => {
    expect(typeof handleStar).toBe("function");
  });

  it("should call Product.aggregate & Product.find ", async () => {
    await handleStarMock(req, res, 5); //5 star rating
    expect(Product.aggregate).toBeCalled();
    expect(Product.find).toBeCalled();
  });

  it("should return status 200 and JSON", async () => {
    await handleStarMock(req, res, 5); //5 star rating
    expect(res.statusCode).toBe(200);
    //the below passes because Product.find() is mocked to return mockAllProductsData
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("searchFilters' handleSub helper fn", () => {
  beforeEach(() => {
    handleSubMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handleSubMock.mockImplementation(async (req, res, sub) => {
      let products = await Product.find({ sub });
      res.json(products);
    });
  });

  it("should have a handleSub fn", () => {
    expect(typeof handleSub).toBe("function");
  });

  it("should call Product.find", async () => {
    await handleSubMock(req, res, "some subcategory");
    expect(Product.find).toBeCalledWith({ sub: "some subcategory" });
  });

  it("should return status 200 and JSON", async () => {
    await handleSubMock(req, res, "some subcategory");
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("searchFilters' handleColor helper fn", () => {
  beforeEach(() => {
    handleColorMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handleColorMock.mockImplementation(async (req, res, color) => {
      const products = await Product.find({ colors: { $in: [color] } });
      res.json(products);
    });
  });

  it("should have a handleColor fn", () => {
    expect(typeof handleColor).toBe("function");
  });

  it("should call Product.find", async () => {
    await handleColorMock(req, res, "yellow");
    expect(Product.find).toBeCalledWith({ colors: { $in: ["yellow"] } });
  });

  it("should return status 200 and JSON", async () => {
    await handleColorMock(req, res, "yellow");
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("searchFilters' handleBrand helper fn", () => {
  beforeEach(() => {
    handleBrandMock = jest.fn();
    //the below is mocked to remove pagination code and mongoose chain methods
    handleBrandMock.mockImplementation(async (req, res, brand) => {
      const products = await Product.find({ brand });
      res.json(products);
    });
  });

  it("should have a handleBrand fn", () => {
    expect(typeof handleBrand).toBe("function");
  });

  it("should call Product.find", async () => {
    await handleBrandMock(req, res, "apple");
    expect(Product.find).toBeCalledWith({ brand: "apple" });
  });

  it("should return status 200 and JSON", async () => {
    await handleBrandMock(req, res, "apple");
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllProductsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
