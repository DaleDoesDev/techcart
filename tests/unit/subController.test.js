const Sub = require("../../models/sub");
const Product = require("../../models/product");

const { create, list, remove, read, update } = require("../../controllers/sub");
const httpMocks = require("node-mocks-http");
const mockSubData = require("../mock-data/sub/sub.json");
const mockAllSubsData = require("../mock-data/sub/allSubs.json");

let req, res, mockedList, mockedRead;

//before each test is ran
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("Sub controller's Create fn", () => {
  beforeEach(() => {
    Sub.create = jest.fn();
    req.body = mockSubData;
  });

  it("should have a create method", () => {
    expect(typeof create).toBe("function");
  });

  it("should call Model.create() with req.body", async () => {
    await create(req, res);
    expect(Sub.create).toBeCalledWith(req.body);
  });

  it("should return res with code 200 and JSON", async () => {
    Sub.create.mockReturnValue(mockSubData);
    await create(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockSubData);
  });

  it("should handle errors", async () => {
    Sub.create.mockReturnValue(Promise.reject("Fake error."));
    await create(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Sub controller's update fn", () => {
  beforeEach(() => {
    Sub.findOneAndUpdate = jest.fn();
    req.body = mockSubData;
    req.params.slug = mockSubData.slug;
  });

  it("should have an update method", () => {
    expect(typeof update).toBe("function");
  });

  it("should call Model.findOneAndUpdate() w. expected selector & updates", async () => {
    await update(req, res);
    expect(Sub.findOneAndUpdate).toBeCalledWith(
      { slug: "Gaming-Laptops" }, //selector
      //updates (in this case, it's the same mock data for a new sub)
      mockSubData,
      { new: true }
    );
  });

  it("should return res with code 200 and JSON", async () => {
    Sub.findOneAndUpdate.mockReturnValue({ mockSubData }, { new: true });
    await update(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ mockSubData }, { new: true });
  });

  it("should handle errors", async () => {
    Sub.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await update(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Sub controller's List fn", () => {
  beforeEach(() => {
    Sub.find = jest.fn(); //spy on this mongoose method
    //the below method's implementation is mocked to remove a mongoose .sort() chain
    mockedList = jest.fn();
    mockedList.mockImplementation(async () => {
      try {
        let subs = await Sub.find({});
        res.json(subs);
      } catch (err) {
        res
          .status(500)
          .json({ error: `Unable to get all subs: ${err.message}` });
      }
    });
  });

  it("should have a list fn", () => {
    expect(typeof list).toBe("function");
  });

  it("should call Sub.find", async () => {
    await mockedList(req, res);
    expect(Sub.find).toBeCalled();
    expect(res.statusCode).toBe(200);
  });

  it("should return 200 statusCode and JSON", async () => {
    Sub.find.mockReturnValue(mockAllSubsData);
    await mockedList(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockAllSubsData);
  });
});

describe("Sub controller's remove fn", () => {
  beforeEach(() => {
    Sub.findOneAndDelete = jest.fn();
  });
  it("should have a remove fn", () => {
    expect(typeof remove).toBe("function");
  });
  it("should call Sub.findOneAndDelete", async () => {
    req.params.slug = mockSubData.slug;
    await remove(req, res);
    expect(Sub.findOneAndDelete).toBeCalledWith({ slug: "Gaming-Laptops" });
  });

  it("should return statusCode 200 and deleted JSON", async () => {
    Sub.findOneAndDelete.mockReturnValue(mockSubData);
    await remove(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockSubData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Sub.findOneAndDelete.mockReturnValue(Promise.reject("fake error"));
    await remove(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Sub controller's read fn", () => {
  beforeEach(() => {
    req.params.slug = mockSubData.slug;
    Sub.findOne = jest.fn();
    Product.find = jest.fn();
    mockedRead = jest.fn();
    //the below's implementation is mocked to remove a mongoose .populate() chain
    mockedRead.mockImplementation(async () => {
      try {
        let sub = await Sub.findOne({ slug: req.params.slug });
        const products = await Product.find({ sub });

        res.json({
          sub,
          products,
        });
      } catch (err) {
        console.log(err);
        res
          .status(400)
          .json({ error: `Unable to find requested sub: ${err.message}` });
      }
    });
  });
  it("should have a read fn", () => {
    expect(typeof read).toBe("function");
  });
  it("should call Sub.findOne", async () => {
    //no need to actually return a product here (focusing on subs)
    Product.find.mockReturnValue("");
    await mockedRead(req, res);
    expect(Sub.findOne).toBeCalledWith({ slug: "Gaming-Laptops" });
  });

  it("should return statusCode 200 and sub JSON", async () => {
    Sub.findOne.mockReturnValue(mockSubData);
    await mockedRead(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().sub).toStrictEqual(mockSubData);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
