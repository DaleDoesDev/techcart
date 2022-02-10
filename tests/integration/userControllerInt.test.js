const request = require("supertest");
const sinon = require("sinon");
const mockUser = require("../mock-data/user/user.json");
const mockProduct = require("../mock-data/product/product.json");
const { dbConnect, dbDisconnect } = require("../dbSetup");
const User = require("../../models/user");
const Product = require("../../models/product");

let app, auth, cart, productResponse, user;

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

describe("User Create integration", () => {
  it("should re-build the user's cart & save to the db", async () => {
    delete mockUser._id; //id not needed here pre-db save
    user = await User.create(mockUser); //create a user, first
    //a new product and its id will be needed
    productResponse = await Product.create(mockProduct);
    //append 'count' to this newly created product document
    cart = [{ ...productResponse._doc, count: 1 }];

    const response = await request(app).post("/api/user/cart").send({ cart });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ok: true });
  });

  it("should handle errors", async () => {
    //send missing data
    const response = await request(app).post("/api/user/cart").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(500);
  });
});

describe("User getUserCart integration", () => {
  it("should GET the user's cart", async () => {
    //create a cart
    await request(app).post("/api/user/cart").send({ cart });
    //retrieve it
    const response = await request(app).get("/api/user/cart");
    expect(response.statusCode).toBe(200);
    expect(response.body.cartTotal).toBe(1049.99);
  });
});

describe("User emptyCart integration", () => {
  it("should empty the user's cart in the db", async () => {
    const response = await request(app).delete("/api/user/cart");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ok: true });
  });
});

describe("User saveAddress integration", () => {
  it("should save the user's address to the db", async () => {
    const response = await request(app)
      .post("/api/user/address")
      .send({ address: "1234 Example st." });
    expect(response.statusCode).toBe(200);
  });
});

describe("User applyCouponToCart integration", () => {
  it("should save the user's address to the db", async () => {
    //create a cart
    await request(app).post("/api/user/cart").send({ cart });
    //create a coupon
    await request(app).post("/api/coupon").send({
      name: "PORTFOLIO",
      expire: "2021-12-22T05:07:32.985Z",
      discount: "15",
    });
    //apply the above coupon to the newly created cart
    const response = await request(app)
      .post("/api/user/cart/coupon")
      .send({ coupon: "PORTFOLIO" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(892.49);
  });

  it("should handle errors", async () => {
    //missing data
    const response = await request(app).post("/api/user/cart/coupon").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("User createOrder integration", () => {
  it("should save an order to the db", async () => {
    const response = await request(app)
      .post("/api/user/order")
      .send({ stripeResponse: { paymentIntent: "test" } });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ok: true });
  });

  it("should handle errors", async () => {
    //missing data
    const response = await request(app).post("/api/user/order").send({});
    expect(JSON.parse(response.text).error).toBeDefined();
    expect(response.statusCode).toBe(400);
  });
});

describe("User orders integration", () => {
  it("should GET all orders", async () => {
    const response = await request(app).get("/api/user/orders");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });
});

describe("User addToWishlist integration", () => {
  it("should add a product to a user's wishlist", async () => {
    const response = await request(app)
      .post("/api/user/wishlist")
      .send({ productId: productResponse._id });
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ok: true });
  });
});

describe("User removeFromWishlist integration", () => {
  it("should removeFromWishlist", async () => {
    const response = await request(app).get("/api/user/wishlist");
    expect(response.statusCode).toBe(200);
  });
});

describe("User wishlist integration", () => {
  it("should GET the user's wishlist", async () => {
    const response = await request(app).put(
      `/api/user/wishlist/${productResponse._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ok: true });
  });
});
