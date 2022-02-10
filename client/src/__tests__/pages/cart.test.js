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

import ProductCardCheckout from "../../components/cards/ProductCardCheckout";
import AlignTop from "../../components/AlignTop";

import { act, waitFor } from "@testing-library/react";
window.scrollTo = jest.fn();

const product = {
  subs: ["61be6cf697a7300771a1579e"],
  _id: 3456,
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

import Cart from "../../pages/Cart";

moxios.install();
const wrapper = mount(
  <Provider store={store}>
    <MemoryRouter>
      <Cart />
    </MemoryRouter>
  </Provider>
);

afterEach(async () => {
  await waitFor(() =>
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          ok: true,
        },
      });
    })
  );
});

describe("Cart", () => {
  const checkoutBtn = wrapper.find({ title: "checkout" });
  const productCheckout = wrapper.find(ProductCardCheckout);
  const alignComponents = wrapper.find(AlignTop);
  const priceCalc = wrapper.find({ title: "price calculation" });

  test("renders", async () => {
    expect(checkoutBtn.length).toBe(1);
    expect(productCheckout.length).toBe(1);
    expect(alignComponents.length).toBe(2);
    expect(priceCalc.length).toBe(1);
    expect(priceCalc.text()).toBe("Dell Latitude 3000 x1 = $1,049.99");
  });
  test("checkoutBtn onClick", async () => {
    checkoutBtn.simulate("click");
    await waitFor(() =>
      moxios.wait(function () {
        expect(mockHistoryPush).toHaveBeenCalled();
      })
    );
  });
});
