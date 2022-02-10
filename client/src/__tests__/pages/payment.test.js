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

import { waitFor } from "@testing-library/react";
window.scrollTo = jest.fn();

import Payment from "../../pages/Payment";
import StripeCheckout from "../../components/StripeCheckout";

moxios.install();
const wrapper = mount(
  <Provider store={store}>
    <MemoryRouter>
      <Payment />
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

describe("Payment", () => {
  test("renders", async () => {
    expect(wrapper.find(StripeCheckout).length).toBe(1);
  });
});
