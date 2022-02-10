const request = require("supertest");
const sinon = require("sinon");
const mockData = require("../mock-data/coupon/coupon.json");
const { dbConnect, dbDisconnect } = require("../dbSetup");

var app, auth, newCouponId;

beforeAll(() => dbConnect());
afterAll(() => dbDisconnect());

beforeEach(function () {
  auth = require("../../middlewares/auth");
  sinon.stub(auth, "authCheck").callsFake(function (req, res, next) {
    return next();
  });
  sinon.stub(auth, "adminCheck").callsFake(function (req, res, next) {
    return next();
  });

  //fully "create" app after
  app = require("../../testServer");
});

afterEach(function () {
  // restore original methods
  auth.authCheck.restore();
  auth.adminCheck.restore();
});

describe("Coupon Create integration", () => {
  it("should create a coupon on POST", async () => {
    const response = await request(app).post("/api/coupon").send(mockData);
    newCouponId = response.body._id;
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should handle errors", async () => {
    //send missing data
    const response = await request(app).post("/api/coupon").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("Coupon List integration", () => {
  it("should GET all coupons", async () => {
    const response = await request(app).get("/api/coupons");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(mockData.name); //verify the first coupon's name
  });
});

describe("Coupon remove integration", () => {
  it("should delete 1 coupon", async () => {
    const response = await request(app).delete(`/api/coupon/${newCouponId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(mockData.title);
  });

  it("should handle errors", async () => {
    let incorrectId = 5364;
    const response = await request(app).delete(`/api/coupon/${incorrectId}`);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.text).error).toBeDefined();
  });
});
