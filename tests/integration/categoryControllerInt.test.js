const request = require("supertest");
const sinon = require("sinon");
const mockData = require("../mock-data/category/category.json");
const mockSubData = require("../mock-data/sub/sub.json");
const { dbConnect, dbDisconnect } = require("../dbSetup");

let app, auth, newCategorySlug, newCategoryId;

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

describe("Category Create integration", () => {
  it("should create a category on POST", async () => {
    const response = await request(app).post("/api/category").send(mockData);
    newCategorySlug = response.body.slug;
    newCategoryId = response.body._id;
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should handle errors", async () => {
    //send missing data
    const response = await request(app).post("/api/category").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("Category Read integration", () => {
  it("should GET a single category", async () => {
    const response = await request(app).get(`/api/category/${newCategorySlug}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.category.name).toBe(mockData.name);
  });
});

describe("Category List integration", () => {
  it("should GET all categories", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(mockData.name); //verify the first category's name
  });
});

describe("Category update integration", () => {
  it("should update a category with PUT", async () => {
    const response = await request(app)
      .put(`/api/category/${newCategorySlug}`)
      .send(mockData);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Category remove integration", () => {
  it("should delete 1 category", async () => {
    const response = await request(app).delete(
      `/api/category/${newCategorySlug}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Category getSubs integration", () => {
  it("should get all subs for a given category id", async () => {
    //create a sub first
    await request(app)
      .post("/api/sub")
      .send({ name: "Windows OS", parent: newCategoryId });

    const response = await request(app).get(
      `/api/category/subs/${newCategoryId}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(mockData.name);
  });
});
