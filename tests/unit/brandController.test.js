const Brand = require("../../models/brand");
const Product = require("../../models/product");
const {
  create,
  list,
  remove,
  read,
  update,
} = require("../../controllers/brand");
const httpMocks = require("node-mocks-http");
const mockBrandData = require("../mock-data/brand/brand.json");
const mockAllBrandsData = require("../mock-data/brand/allBrands.json");

let req, res, mockedList, mockedRead;

//before each test is ran
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("Brand controller's Create fn", () => {
  beforeEach(() => {
    Brand.create = jest.fn();
    req.body = mockBrandData;
  });

  it("should have a create method", () => {
    expect(typeof create).toBe("function");
  });

  it("should call Model.create() with req.body", async () => {
    await create(req, res);
    expect(Brand.create).toBeCalledWith(req.body);
  });

  it("should return res with code 200 and JSON", async () => {
    Brand.create.mockReturnValue(mockBrandData);
    await create(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockBrandData);
  });

  it("should handle errors", async () => {
    Brand.create.mockReturnValue(Promise.reject("Fake error."));
    await create(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's update fn", () => {
  beforeEach(() => {
    Brand.findOneAndUpdate = jest.fn();
    req.body = mockBrandData;
    req.params.slug = mockBrandData.slug;
  });

  it("should have an update method", () => {
    expect(typeof update).toBe("function");
  });

  it("should call Model.findOneAndUpdate() w. expected selector & updates", async () => {
    await update(req, res);
    expect(Brand.findOneAndUpdate).toBeCalledWith(
      { slug: "Brand-Name" }, //selector
      //updates (in this case, it's the same mock data for a new brand)
      mockBrandData,
      { new: true }
    );
  });

  it("should return res with code 200 and JSON", async () => {
    Brand.findOneAndUpdate.mockReturnValue({ mockBrandData }, { new: true });
    await update(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ mockBrandData }, { new: true });
  });

  it("should handle errors", async () => {
    Brand.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await update(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's List fn", () => {
  beforeEach(() => {
    Brand.find = jest.fn(); //spy on this mongoose method
    //the below method's implementation is mocked to remove a mongoose .sort() chain
    mockedList = jest.fn();
    mockedList.mockImplementation(async () => {
      try {
        let brands = await Brand.find({});
        res.json(brands);
      } catch (err) {
        res
          .status(500)
          .json({ error: `Unable to get all brands: ${err.message}` });
      }
    });
  });

  it("should have a list fn", () => {
    expect(typeof list).toBe("function");
  });

  it("should call Brand.find", async () => {
    await mockedList(req, res);
    expect(Brand.find).toBeCalled();
    expect(res.statusCode).toBe(200);
  });

  it("should return 200 statusCode and JSON", async () => {
    Brand.find.mockReturnValue(mockAllBrandsData);
    await mockedList(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockAllBrandsData);
  });

  it("should handle errors", async () => {
    Brand.find.mockReturnValue(Promise.reject("fake error"));
    await mockedList(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(500);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's remove fn", () => {
  beforeEach(() => {
    Brand.findOneAndDelete = jest.fn();
  });
  it("should have a remove fn", () => {
    expect(typeof remove).toBe("function");
  });
  it("should call Brand.findOneAndDelete", async () => {
    req.params.slug = mockBrandData.slug;
    await remove(req, res);
    expect(Brand.findOneAndDelete).toBeCalledWith({ slug: "Brand-Name" });
  });

  it("should return statusCode 200 and deleted JSON", async () => {
    Brand.findOneAndDelete.mockReturnValue(mockBrandData);
    await remove(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockBrandData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Brand.findOneAndDelete.mockReturnValue(Promise.reject("fake error"));
    await remove(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's read fn", () => {
  beforeEach(() => {
    req.params.slug = mockBrandData.slug;
    Brand.findOne = jest.fn();
    Product.find = jest.fn();
    mockedRead = jest.fn();
    //the below's implementation is mocked to remove a mongoose .populate() chain
    mockedRead.mockImplementation(async () => {
      try {
        let brand = await Brand.findOne({ slug: req.params.slug });
        const products = await Product.find({ brand });

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
    });
  });
  it("should have a read fn", () => {
    expect(typeof read).toBe("function");
  });
  it("should call Brand.findOne", async () => {
    Product.find.mockReturnValue(""); //no need to actually return a product here (focusing on brands)
    await mockedRead(req, res);
    expect(Brand.findOne).toBeCalledWith({ slug: "Brand-Name" });
  });

  it("should return statusCode 200 and brand JSON", async () => {
    Brand.findOne.mockReturnValue(mockBrandData);
    await mockedRead(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().brand).toStrictEqual(mockBrandData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Brand.findOne.mockReturnValue(Promise.reject("fake error"));
    await mockedRead(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
