import React from "react";
import Enzyme, { mount } from "enzyme";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import { CardElement } from "@stripe/react-stripe-js";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import rootReducer from "../reducers";
const store = createStore(rootReducer);
import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

moxios.install();

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
};

function mockElement() {
  return {
    mount: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn(),
    update: jest.fn(),
  };
}

jest.mock("@stripe/react-stripe-js", () => {
  const stripe = jest.requireActual("@stripe/react-stripe-js");

  return {
    ...stripe,
    Element: () => {
      return mockElement;
    },
    useStripe: () => {
      return {
        elements: jest.fn(() => mockElements()),
        createToken: jest.fn(),
        createSource: jest.fn(),
        createPaymentMethod: jest.fn(),
        confirmCardPayment: () => {
          return {
            payload: "test",
          };
        },
        confirmCardSetup: jest.fn(),
        paymentRequest: jest.fn(),
        _registerWrapper: jest.fn(),
      };
    },
    useElements: () => {
      return {
        create: jest.fn(),
        getElement: jest.fn(),
      };
    },
  };
});

jest.mock("../utilities/stripe", () => ({
  createPaymentIntent: () =>
    Promise.resolve({
      data: {
        clientSecret: "example",
      },
    }),
}));

jest.mock("../utilities/user", () => ({
  createOrder: () =>
    Promise.resolve({
      data: {
        ok: true,
      },
    }),
  emptyUserCart: () =>
    Promise.resolve({
      data: {
        ok: true,
      },
    }),
}));

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

import StripeCheckout from "../components/StripeCheckout";
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

describe("StripeCheckout", () => {
  test("renders", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Elements stripe={promise}>
              <StripeCheckout />
            </Elements>
          </MemoryRouter>
        </Provider>
      );
      const cardEl = wrapper.find(CardElement);
      const form = wrapper.find("form");
      expect(cardEl.length).toBe(1);
      expect(form.length).toBe(1);
    });
  });
  test("cardEl onChange", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Elements stripe={promise}>
              <StripeCheckout />
            </Elements>
          </MemoryRouter>
        </Provider>
      );
      const cardEl = wrapper.find(CardElement);
      await act(async () => {
        await cardEl.props().onChange({ empty: false });
      });
    });
  });
  test("form handleSubmit", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Elements stripe={promise}>
              <StripeCheckout />
            </Elements>
          </MemoryRouter>
        </Provider>
      );
      const form = wrapper.find("form");
      await form.simulate("submit");
    });
  });
});
