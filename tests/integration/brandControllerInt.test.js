const request = require("supertest");
const sinon = require("sinon");
const mockData = require("../mock-data/brand/brand.json");
const { dbConnect, dbDisconnect } = require("../dbSetup");

let app, auth, newBrandSlug;
let incorrectSlug = "error-slug";

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

describe("Brand Create integration", () => {
  it("should create a brand on POST", async () => {
    const response = await request(app).post("/api/brand").send(mockData);
    newBrandSlug = response.body.slug;
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should handle errors", async () => {
    //send missing data
    const response = await request(app).post("/api/brand").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("Brand Read integration", () => {
  it("should GET a single brand", async () => {
    const response = await request(app).get(`/api/brand/${newBrandSlug}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.brand.name).toBe(mockData.name);
  });
});

describe("Brand List integration", () => {
  it("should GET all brands", async () => {
    const response = await request(app).get("/api/brands");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(mockData.name); //verify the first coupon's name
  });
});

describe("Brand update integration", () => {
  it("should update a brand with PUT", async () => {
    const response = await request(app)
      .put(`/api/brand/${newBrandSlug}`)
      .send(mockData);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Brand remove integration", () => {
  it("should delete 1 brand", async () => {
    const response = await request(app).delete(`/api/brand/${newBrandSlug}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should handle errors", async () => {
    const response = await request(app).delete(`/api/coupon/${incorrectSlug}`);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.text).error).toBeDefined();
  });
});
