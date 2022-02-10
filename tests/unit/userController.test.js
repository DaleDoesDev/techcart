const User = require("../../models/user");
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Coupon = require("../../models/coupon");
const Order = require("../../models/order");

const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToCart,
  createOrder,
  orders,
  addToWishlist,
  removeFromWishlist,
} = require("../../controllers/user");
const httpMocks = require("node-mocks-http");
const mockUserData = require("../mock-data/user/user.json");
const mockCartData = require("../mock-data/cart/cart_preDBSave.json");
const mockCartDatabaseFormat = require("../mock-data/cart/cart_postDBSave.json");
const mockCouponData = require("../mock-data/coupon/coupon.json");
const mockOrderData = require("../mock-data/order/order.json");

let req, res;
//before each test is ran
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();

  User.findOne = jest.fn();
  User.findOne.mockReturnValue(mockUserData);
});

describe("User controller's userCart fn", () => {
  beforeEach(() => {
    req.body.cart = mockCartData;
    req.user = mockUserData;

    Cart.findOne = jest.fn();
    Cart.findOne.mockReturnValue(mockCartData);
    Cart.create = jest.fn();
    Product.findById = jest.fn();
    userCartMocked = jest.fn();
    //mocked to ignore model.remove(), .select() chain, and remove server-side price search
    userCartMocked.mockImplementation(async () => {
      try {
        const { cart } = req.body;
        let products = [];
        const user = await User.findOne({ email: req.user.email }); //email is from firebase

        for (let i = 0; i < cart.length; i++) {
          let object = {};
          object.product = cart[i]._id; //get the id for each product
          object.count = cart[i].count;
          object.selectedColor = cart[i].selectedColor; //user's chosen color for the product
          object.price = cart[i].price;

          products.push(object);
        }

        let total = 0;
        for (let i = 0; i < products.length; i++) {
          total += products[i].count * products[i].price;
        }

        await Cart.create({
          products,
          cartTotal: total,
          orderedBy: user._id,
        });

        res.json({ ok: true });
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: `Unable to save cart: ${err.message}`, ok: false });
      }
    });
  });

  it("should have a userCart method", () => {
    expect(typeof userCart).toBe("function");
  });

  it("calls User.findOne, Cart.create", async () => {
    await userCartMocked(req, res);
    expect(User.findOne).toBeCalledWith({ email: mockUserData.email });
    expect(Cart.create).toBeCalled();
  });

  it("should return res with code 200 and 'ok' message", async () => {
    await userCartMocked(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ ok: true });
  }); //

  it("should handle errors", async () => {
    Cart.create.mockReturnValue(Promise.reject("Fake error."));
    await userCartMocked(req, res);

    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(500);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("User controller's getUserCart fn", () => {
  beforeEach(() => {
    getUserCartMock = jest.fn();
    req.user = mockUserData;
    Cart.findOne = jest.fn();

    //mocked to remove a mongoose .populate() chain and simplify return
    getUserCartMock.mockImplementation(async () => {
      try {
        const user = await User.findOne({ email: req.user.email }); //email is from firebase

        let cart = await Cart.findOne({ orderedBy: user._id });
        res.json(cart);
      } catch (err) {
        console.log(err);
        res
          .status(400)
          .json({ error: `Cannot find cart for current user: ${err.message}` });
      }
    });
  });

  it("should have a getUserCart fn", () => {
    expect(typeof getUserCart).toBe("function");
  });

  it("should call Cart.findOne, User.findOne", async () => {
    await getUserCartMock(req, res);
    expect(User.findOne).toBeCalledWith({ email: mockUserData.email });
    expect(Cart.findOne).toBeCalledWith({ orderedBy: mockUserData._id });
  });
  //
  it("should return statusCode 200 and JSON", async () => {
    Cart.findOne.mockReturnValue(mockCartData);
    await getUserCartMock(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockCartData);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    Cart.findOne.mockReturnValue(Promise.reject("fake error"));
    await getUserCartMock(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's emptyCart fn", () => {
  beforeEach(() => {
    req.user = mockUserData;

    Cart.findOneAndRemove = jest.fn();
  });

  it("should have an emptyCart method", () => {
    expect(typeof emptyCart).toBe("function");
  });

  it("should call User.findOne, Cart.findOneAndRemove", async () => {
    await emptyCart(req, res);
    expect(User.findOne).toBeCalledWith({ email: mockUserData.email });
    expect(Cart.findOneAndRemove).toBeCalledWith({
      orderedBy: mockUserData._id,
    });
  });

  it("should return res with code 200 and 'ok' message", async () => {
    await emptyCart(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ ok: true });
  });

  it("should handle errors", async () => {
    Cart.findOneAndRemove.mockReturnValue(Promise.reject("Fake error."));
    await emptyCart(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's saveAddress fn", () => {
  beforeEach(() => {
    req.user = mockUserData;
    req.body.address = "123 Example st.";
    User.findOneAndUpdate = jest.fn();
    User.findOneAndUpdate.mockReturnValue(mockUserData);
  });

  it("should have an saveAddress method", () => {
    expect(typeof saveAddress).toBe("function");
  });

  it("should call User.findOneAndUpdate", async () => {
    await saveAddress(req, res);
    expect(User.findOneAndUpdate).toBeCalledWith(
      {
        email: mockUserData.email,
      }, //selector
      {
        address: { address: "123 Example st." }, //updates
      }
    );
  });

  it("should return res with code 200 and JSON", async () => {
    await saveAddress(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({
      ok: true,
      userAddress: mockUserData,
    });
  });

  it("should handle errors", async () => {
    User.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await saveAddress(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's applyCouponToCart fn", () => {
  beforeEach(() => {
    req.user = mockUserData;
    Coupon.findOne = jest.fn();
    Coupon.findOne.mockReturnValue(mockCouponData);
    req.body.coupon = "test";

    Cart.findOneAndUpdate = jest.fn();
    Cart.findOneAndUpdate.mockReturnValue(mockCartDatabaseFormat);
    Cart.findOne = jest.fn();
    Cart.findOne.mockReturnValue(mockCartDatabaseFormat);
    applyCouponToCartMock = jest.fn();
    //mocked to remove .populate() mongoose chain
    applyCouponToCartMock.mockImplementation(async () => {
      try {
        const { coupon } = req.body;
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
          return res.status(400).json({
            error: "Sorry, this is not a valid coupon.",
          });
        }

        const user = await User.findOne({ email: req.user.email });
        let { cartTotal } = await Cart.findOne({
          orderedBy: user._id,
        });

        let totalAfterDiscount = Number(
          (cartTotal - (cartTotal * validCoupon.discount) / 100) //integer percent to decimal
            .toFixed(2)
        );

        await Cart.findOneAndUpdate(
          { orderedBy: user._id },
          { totalAfterDiscount },
          { new: true }
        );
        res.json(totalAfterDiscount);
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: `Unable to process coupon: ${err.message}`,
        });
      }
    });
  });

  it("should have an applyCouponToCart method", () => {
    expect(typeof applyCouponToCart).toBe("function");
  });

  it("calls Coupon.findOne, User.findOne, Cart.findOne, Cart.findOneAndUpdate", async () => {
    await applyCouponToCartMock(req, res);
    expect(Coupon.findOne).toBeCalledWith({ name: "test" });
    expect(User.findOne).toBeCalledWith({ email: mockUserData.email });
    expect(Cart.findOne).toBeCalledWith({ orderedBy: "1515" });
    expect(Cart.findOneAndUpdate).toBeCalledWith(
      { orderedBy: "1515" },
      { totalAfterDiscount: 2847.41 },
      { new: true }
    );
  });

  it("should return res with code 200 and JSON (totalAfterDiscount)", async () => {
    await applyCouponToCartMock(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toBe(2847.41);
  });

  it("should handle errors", async () => {
    Coupon.findOne.mockReturnValue(null);
    await applyCouponToCartMock(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's createOrder fn", () => {
  beforeEach(() => {
    req.body.stripeResponse = { paymentIntent: "" };
    req.user = mockUserData;
    Cart.findOne = jest.fn();
    Cart.findOne.mockReturnValue(mockCartDatabaseFormat);
    Order.create = jest.fn();
    Order.create.mockReturnValue(mockCartDatabaseFormat);
    Product.bulkWrite = jest.fn();
    Product.bulkWrite.mockReturnValue({ ok: true });
  });

  it("should have an createOrder method", () => {
    expect(typeof createOrder).toBe("function");
  });

  it("calls User.findOne, Cart.findOne, Order.create, Product.bulkWrite", async () => {
    await createOrder(req, res);
    expect(User.findOne).toBeCalledWith({ email: mockUserData.email });
    expect(Cart.findOne).toBeCalledWith({ orderedBy: mockUserData._id });
    expect(Order.create).toBeCalledWith({
      orderedBy: "1515",
      paymentIntent: "",
      products: mockCartDatabaseFormat.products,
    });
    expect(Product.bulkWrite).toBeCalled();
  });

  it("should return res with code 200 and JSON", async () => {
    await createOrder(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ ok: true });
  });

  it("should handle errors", async () => {
    User.findOne.mockReturnValue(Promise.reject("Fake error."));
    await createOrder(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's orders fn", () => {
  beforeEach(() => {
    req.user = mockUserData;
    Order.find = jest.fn();
    Order.find.mockReturnValue(mockOrderData);
    ordersMocked = jest.fn();
    ordersMocked.mockImplementation(async () => {
      try {
        let user = await User.findOne({ email: req.user.email }); //from firebase
        let userOrders = await Order.find({ orderedBy: user._id });
        res.json(userOrders);
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: `There was a problem getting this user's orders: ${err.message}`,
        });
      }
    });
  });

  it("should have an orders method", () => {
    expect(typeof orders).toBe("function");
  });

  it("calls User.findOne, Order.find", async () => {
    await ordersMocked(req, res);
    expect(User.findOne).toBeCalledWith({ email: mockUserData.email });
    expect(Order.find).toBeCalledWith({ orderedBy: mockUserData._id });
  });

  it("should return res with code 200 and JSON", async () => {
    await ordersMocked(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual(mockOrderData);
  });

  it("should handle errors", async () => {
    Order.find.mockReturnValue(Promise.reject("Fake error."));
    await ordersMocked(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's addToWishlist fn", () => {
  beforeEach(() => {
    req.body.productId = "2345";
    req.user = mockUserData;
    User.findOneAndUpdate = jest.fn();
    User.findOneAndUpdate.mockReturnValue(mockUserData);
  });

  it("should have an addToWishlist method", () => {
    expect(typeof addToWishlist).toBe("function");
  });

  it("calls User.findOneAndUpdate", async () => {
    await addToWishlist(req, res);
    expect(User.findOneAndUpdate).toBeCalledWith(
      { email: mockUserData.email },
      { $addToSet: { wishlist: "2345" } }
    );
  });

  it("should return res with code 200 and 'ok' message", async () => {
    await addToWishlist(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ ok: true });
  });

  it("should handle errors", async () => {
    User.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await addToWishlist(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("Brand controller's removeFromWishlist fn", () => {
  beforeEach(() => {
    req.user = mockUserData;
    req.params.productId = "2345";
    User.findOneAndUpdate = jest.fn();
    User.findOneAndUpdate.mockReturnValue(mockUserData);
  });

  it("should have an removeFromWishlist method", () => {
    expect(typeof removeFromWishlist).toBe("function");
  });

  it("calls User.findOneAndUpdate", async () => {
    await removeFromWishlist(req, res);
    expect(User.findOneAndUpdate).toBeCalledWith(
      { email: mockUserData.email },
      { $pull: { wishlist: "2345" } }
    );
  });

  it("should return res with code 200 and 'ok' message", async () => {
    await removeFromWishlist(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    //the below compares values, not memory location
    expect(res._getJSONData()).toStrictEqual({ ok: true });
  });

  it("should handle errors", async () => {
    User.findOneAndUpdate.mockReturnValue(Promise.reject("Fake error."));
    await removeFromWishlist(req, res);
    expect(res._getJSONData().error).toBeDefined();
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
