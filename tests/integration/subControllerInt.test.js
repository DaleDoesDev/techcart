const request = require("supertest");
const sinon = require("sinon");
const mockData = require("../mock-data/sub/sub.json");
const { dbConnect, dbDisconnect } = require("../dbSetup");

let app, auth;

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

describe("Sub Create integration", () => {
  it("should create a subcategory on POST", async () => {
    const response = await request(app).post("/api/sub").send(mockData);
    newSubSlug = response.body.slug;
    newSubId = response.body._id;
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should handle errors", async () => {
    //send missing data
    const response = await request(app).post("/api/sub").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("Sub Read integration", () => {
  it("should GET a single sub", async () => {
    const response = await request(app).get(`/api/sub/${newSubSlug}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.sub.name).toBe(mockData.name);
  });
});

describe("Sub List integration", () => {
  it("should GET all subs", async () => {
    const response = await request(app).get("/api/subs");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(mockData.name); //verify the first subcategory's name
  });
});

describe("Sub update integration", () => {
  it("should update a sub with PUT", async () => {
    const response = await request(app)
      .put(`/api/sub/${newSubSlug}`)
      .send(mockData);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Sub remove integration", () => {
  it("should delete 1 sub", async () => {
    const response = await request(app).delete(`/api/sub/${newSubSlug}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});
