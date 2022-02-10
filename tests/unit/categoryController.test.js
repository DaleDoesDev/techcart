const Category = require("../../models/category");
const Product = require("../../models/product");
const Sub = require("../../models/sub");

const {
  create,
  list,
  remove,
  read,
  update,
  getSubs,
} = require("../../controllers/category");
const httpMocks = require("node-mocks-http");
const mockCategoryData = require("../mock-data/category/category.json");
const mockAllCategoriesData = require("../mock-data/category/allCategories.json");
const mockAllSubsData = require("../mock-data/sub/allSubs.json");

let req, res, mockedList, mockedRead;

//before each test is ran
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("Category controller's Create fn", () => {
  beforeEach(() => {
    Category.create = jest.fn();
    req.body = mockCategoryData;
  });

  it("should have a create method", () => {
    expect(typeof create).toBe("function");
  });

  it("should call Model.create() with req.body", async () => {
    await create(req, res);
    expect(Category.create).toBeCalledWith(req.body);
  });

  it("should return res with code 200 and JSON", async () => {
    Category.create.mockReturnValue(mockCategoryData);
    await create(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockCategoryData);
  });

  it("should handle errors", async () => {
    Category.create.mockReturnValue(Promise.reject("Fake error."));
    await create(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Category controller's update fn", () => {
  beforeEach(() => {
    Category.findOneAndUpdate = jest.fn();
    req.body = mockCategoryData;
    req.params.slug = mockCategoryData.slug;
  });

  it("should have an update method", () => {
    expect(typeof update).toBe("function");
  });

  it("should call Model.findOneAndUpdate() w. expected selector & updates", async () => {
    await update(req, res);
    expect(Category.findOneAndUpdate).toBeCalledWith(
      { slug: "Windows-OS" }, //selector
      //updates (in this case, it's the same mock data for a new category)
      mockCategoryData,
      { new: true }
    );
  });

  it("should return res with code 200 and JSON", async () => {
    Category.findOneAndUpdate.mockReturnValue(
      { mockCategoryData },
      { new: true }
    );
    await update(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(
      { mockCategoryData },
      { new: true }
    );
  });

  it("should handle errors", async () => {
    Category.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await update(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Category controller's List fn", () => {
  beforeEach(() => {
    Category.find = jest.fn(); //spy on this mongoose method
    //the below method's implementation is mocked to remove a mongoose .sort() chain
    mockedList = jest.fn();
    mockedList.mockImplementation(async () => {
      try {
        let categories = await Category.find({});
        res.json(categories);
      } catch (err) {
        res
          .status(500)
          .json({ error: `Unable to get all categories: ${err.message}` });
      }
    });
  });

  it("should have a list fn", () => {
    expect(typeof list).toBe("function");
  });

  it("should call Category.find", async () => {
    await mockedList(req, res);
    expect(Category.find).toBeCalled();
    expect(res.statusCode).toBe(200);
  });

  it("should return 200 statusCode and JSON", async () => {
    Category.find.mockReturnValue(mockAllCategoriesData);
    await mockedList(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockAllCategoriesData);
  });
});

describe("Category controller's remove fn", () => {
  beforeEach(() => {
    Category.findOneAndDelete = jest.fn();
  });
  it("should have a remove fn", () => {
    expect(typeof remove).toBe("function");
  });
  it("should call Category.findOneAndDelete", async () => {
    req.params.slug = mockCategoryData.slug;
    await remove(req, res);
    expect(Category.findOneAndDelete).toBeCalledWith({ slug: "Windows-OS" });
  });

  it("should return statusCode 200 and deleted JSON", async () => {
    Category.findOneAndDelete.mockReturnValue(mockCategoryData);
    await remove(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockCategoryData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Category.findOneAndDelete.mockReturnValue(Promise.reject("fake error"));
    await remove(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Category controller's read fn", () => {
  beforeEach(() => {
    req.params.slug = mockCategoryData.slug;
    Category.findOne = jest.fn();
    Product.find = jest.fn();
    mockedRead = jest.fn();
    //the below's implementation is mocked to remove a mongoose .populate() chain
    mockedRead.mockImplementation(async () => {
      try {
        let category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category });

        res.json({
          category,
          products,
        });
      } catch (err) {
        console.log(err);
        res
          .status(400)
          .json({ error: `Unable to find requested category: ${err.message}` });
      }
    });
  });
  it("should have a read fn", () => {
    expect(typeof read).toBe("function");
  });
  it("should call Category.findOne", async () => {
    //no need to actually return a product here (focusing on categories)
    Product.find.mockReturnValue("");
    await mockedRead(req, res);
    expect(Category.findOne).toBeCalledWith({ slug: "Windows-OS" });
  });

  it("should return statusCode 200 and category JSON", async () => {
    Category.findOne.mockReturnValue(mockCategoryData);
    await mockedRead(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().category).toStrictEqual(mockCategoryData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Category controller's getSubs fn", () => {
  beforeEach(() => {
    Sub.find = jest.fn();
    Sub.find.mockReturnValue(mockAllSubsData);
    req.params._id = 2345;
  });
  it("should have a getSubs fn", () => {
    expect(typeof getSubs).toBe("function");
  });

  it("should call Sub.find()", async () => {
    await getSubs(req, res);
    expect(Sub.find).toBeCalledWith({ parent: 2345 });
  });

  it("should return statusCode 200 and subcategories JSON", async () => {
    await getSubs(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockAllSubsData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
