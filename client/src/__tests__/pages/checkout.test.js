import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import rootReducer from "../../reducers";
const store = createStore(rootReducer);

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

import { act, waitFor } from "@testing-library/react";

window.scrollTo = jest.fn();

const product = {
  subs: ["61be6cf697a7300771a1579e"],
  _id: "kdjggkdjbn",
  sold: 0,
  images: [],
  colors: ["Black"],
  brand: "61be6cf697a7300771a157a3",
  category: "61be6cf697a7300771a15795",
  description: "<p>Short HTML description</p>",
  price: 1049.99,
  quantity: 25,
  ratings: [],
  slug: "dell-latitude-3000",
  title: "Dell Latitude 3000",
  count: 1,
};

jest.mock("../../utilities/user", () => {
  const originalModule = jest.requireActual("../../utilities/user");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    applyCoupon: () => Promise.resolve({ data: 1049.99 }),
    saveUserAddress: () => Promise.resolve({ data: { ok: true } }),
    emptyUserCart: () => Promise.resolve({ data: { ok: true } }),
  };
});

store.dispatch({
  type: "ADD_TO_CART",
  payload: [product],
});

store.dispatch({
  type: "LOGGED_IN_USER",
  payload: {
    _id: "1515",
    role: "admin",
    cart: [],
    wishlist: [],
    email: "test@gmail.com",
    name: "test",
    token: "example123",
    address: { address: "123 Example St.", zip: 12345 },
  },
});

import Checkout from "../../pages/Checkout";

moxios.install();
const wrapper = mount(
  <Provider store={store}>
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  </Provider>
);

beforeEach(async () => {
  await waitFor(() =>
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      let requestTwo = moxios.requests.at(0);

      if (requestTwo.url === "http://localhost:8000/api/user/cart") {
        requestTwo.respondWith({
          status: 200,
          response: {
            products: [
              {
                product: product,
              },
            ],
            cartTotal: product.price,
          },
        });
      } else
        request.respondWith({
          status: 200,
          response: {
            ok: true,
          },
        });
    })
  );
});

describe("Checkout", () => {
  const addressInput = wrapper.find({
    title: "Please enter your delivery address",
  });
  const zipInput = wrapper.find({
    title: "Please enter your 5 digit zipcode",
  });
  const addressSaveBtn = wrapper.find({
    title: "address save button",
  });
  const couponInput = wrapper.find({
    title: "coupon",
  });
  const couponBtn = wrapper.find({
    title: "apply coupon",
  });
  const orderBtn = wrapper.find({
    title: "order",
  });
  const form = wrapper.find("form");
  const emptyCartBtn = wrapper.find({
    title: "empty cart",
  });

  test("renders", async () => {
    expect(addressInput.length).toBe(1);
    expect(zipInput.length).toBe(1);
    expect(addressSaveBtn.length).toBe(1);
    expect(couponInput.length).toBe(1);
    expect(couponBtn.length).toBe(1);
    expect(orderBtn.length).toBe(1);
    expect(form.length).toBe(1);
    expect(emptyCartBtn.length).toBe(1);
  });
  test("address inputs onChange", async () => {
    addressInput.simulate("change", { target: { value: "123 Example st." } });
  });
  test("zipInput onChange", async () => {
    zipInput.simulate("change", { target: { value: "24354" } });
  });
  test("coupon input onChange", async () => {
    couponInput.simulate("change", { target: { value: "test" } });
  });
  test("coupon btn click", async () => {
    await act(async () => {
      await couponBtn.simulate("click");
    });
  });
  test("order btn click", async () => {
    await act(async () => {
      await orderBtn.props().onClick();
    });
  });
  test("form onSubmit", async () => {
    await act(async () => {
      await form.simulate("submit");
    });
  });

  test("emptyCartBtn onClick", async () => {
    await act(async () => {
      await emptyCartBtn.simulate("click");
    });
  });
});
