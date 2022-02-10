const request = require("supertest");
const sinon = require("sinon");
const mockData = require("../mock-data/product/product.json");
const mockUser = require("../mock-data/user/user.json");
const User = require("../../models/user");
const { dbConnect, dbDisconnect } = require("../dbSetup");

let app, auth;
//the below are updated once a product is created in the live db
let newProductSlug,
  newProductId,
  newProductCategory,
  newProductSub,
  newProductBrand;

beforeAll(() => dbConnect());
afterAll(() => dbDisconnect());

beforeEach(function () {
  auth = require("../../middlewares/auth");
  sinon.stub(auth, "authCheck").callsFake(function (req, res, next) {
    req.user = mockUser; //append the user
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

describe("Product Create integration", () => {
  it("should create a product on POST", async () => {
    const response = await request(app).post("/api/product").send(mockData);
    newProductSlug = response.body.slug;
    newProductId = response.body._id;
    newProductCategory = response.body.category;
    newProductSub = response.body.subs[0];
    newProductBrand = response.body.brand;
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should handle errors", async () => {
    //send missing data
    const response = await request(app).post("/api/product").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("Product productsCount integration", () => {
  it("should return the number of products", async () => {
    const response = await request(app).get(`/api/products/total`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(1);
  });
});

describe("Product productStar integration", () => {
  it("update product with a new rating through PUT", async () => {
    //a user is required to post a rating to a product
    let newMockUser = mockUser;
    delete newMockUser._id; //the fake id must be removed for integration
    await User.create(newMockUser);

    const response = await request(app)
      .put(`/api/product/star/${newProductId}`)
      .send({ star: 5 }); //5 star rating
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Product Read integration", () => {
  it("should GET a single product", async () => {
    const response = await request(app).get(`/api/product/${newProductSlug}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Product List integration", () => {
  it("should get all products using POST", async () => {
    //specify 'sort', 'order', & 'descending' with a POST request
    const response = await request(app)
      .post("/api/products")
      .send({ sort: "createdAt", order: "desc", count: 6 });
    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe(mockData.name); //verify the first product's name
  });
});

describe("Product listRelated integration", () => {
  it("should get related products as an array", async () => {
    const response = await request(app).get(
      `/api/product/related/${newProductId}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Product searchFilters integration", () => {
  it("should get products based on text query POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ query: "Dell" });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
  it("should get products based on price arr, POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ price: [100.5, 1999.99] });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should get products based on category POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ category: newProductCategory });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should get products based on subcategory POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ sub: newProductSub });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should get products based on color POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ color: "Black" });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should get products based on rating POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ stars: 5 });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });

  it("should get products based on brand POST req", async () => {
    const response = await request(app)
      .post(`/api/search/filters`)
      .send({ brand: newProductBrand });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Product update integration", () => {
  it("should update a product with PUT", async () => {
    const response = await request(app)
      .put(`/api/product/${newProductSlug}`)
      .send(mockData);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});

describe("Product remove integration", () => {
  it("should delete 1 product", async () => {
    const response = await request(app).delete(
      `/api/product/${newProductSlug}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockData.name);
  });
});
