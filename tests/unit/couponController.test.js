const Coupon = require("../../models/coupon");
const { create, list, remove } = require("../../controllers/coupon");
const httpMocks = require("node-mocks-http");
const mockCouponData = require("../mock-data/coupon/coupon.json");
const mockAllCouponsData = require("../mock-data/coupon/allCoupons.json");

let req, res, mockedList;

//before each test is ran
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("Coupon controller's Create fn", () => {
  beforeEach(() => {
    Coupon.create = jest.fn();
    req.body = mockCouponData;
  });

  it("should have a create method", () => {
    expect(typeof create).toBe("function");
  });

  it("should call Model.create() with req.body", async () => {
    await create(req, res);
    expect(Coupon.create).toBeCalledWith(req.body);
  });

  it("should return res with code 200 and JSON", async () => {
    Coupon.create.mockReturnValue(mockCouponData);
    await create(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockCouponData);
  });

  it("should handle errors", async () => {
    Coupon.create.mockReturnValue(Promise.reject("Fake error."));
    await create(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Coupon controller's List fn", () => {
  beforeEach(() => {
    Coupon.find = jest.fn(); //spy on this mongoose method
    //the below method's implementation is mocked to remove a mongoose .sort() chain
    mockedList = jest.fn();
    mockedList.mockImplementation(async () => {
      try {
        let coupons = await Coupon.find({});
        res.json(coupons);
      } catch (err) {
        res
          .status(500)
          .json({ error: `Unable to get all coupons: ${err.message}` });
      }
    });
  });

  it("should have a list fn", () => {
    expect(typeof list).toBe("function");
  });

  it("should call Coupon.find", async () => {
    await mockedList(req, res);
    expect(Coupon.find).toBeCalled();
    expect(res.statusCode).toBe(200);
  });

  it("should return 200 statusCode and JSON", async () => {
    Coupon.find.mockReturnValue(mockAllCouponsData);
    await mockedList(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockAllCouponsData);
  });

  it("should handle errors", async () => {
    Coupon.find.mockReturnValue(Promise.reject("fake error"));
    await mockedList(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(500);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Coupon controller's remove fn", () => {
  beforeEach(() => {
    Coupon.findByIdAndDelete = jest.fn();
    req.params.couponId = 2022;
  });
  it("should have a remove fn", () => {
    expect(typeof remove).toBe("function");
  });
  it("should call Coupon.findByIdAndDelete", async () => {
    await remove(req, res);
    expect(Coupon.findByIdAndDelete).toBeCalledWith(2022);
  });
  it("should return statusCode 200 and deleted JSON", async () => {
    Coupon.findByIdAndDelete.mockReturnValue(mockCouponData);
    await remove(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockCouponData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Coupon.findByIdAndDelete.mockReturnValue(Promise.reject("fake error"));
    await remove(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(500);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
