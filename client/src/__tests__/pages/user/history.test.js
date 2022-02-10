import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import rootReducer from "../../../reducers";
const store = createStore(rootReducer);

import History from "../../../pages/user/History";
import UserNav from "../../../components/nav/UserNav";
import ShowPaymentInfo from "../../../components/cards/ShowPaymentInfo";

import { act, waitFor } from "@testing-library/react";
window.scrollTo = jest.fn();

const orders = [
  {
    _id: "61be6d8858012c077af1c68f",
    orderStatus: "Not Processed",
    products: [
      {
        _id: "61be6d5e58012c077af1c676",
        product: {
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
        },
        count: 1,
        selectedColor: "Gray",
      },
    ],
    paymentIntent: {
      id: "pi_3K8CFdL1YUgKoCXC1FiV8cHG",
    },
    orderedBy: {
      _id: "618ad88d533e172c02a67d63",
      address: { address: "123 Example st.", zip: 43565 },
    },
  },
];

jest.mock("../../../utilities/user", () => {
  const originalModule = jest.requireActual("../../../utilities/user");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getUserOrders: () => Promise.resolve({ data: orders }),
  };
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

moxios.install();

describe("history", () => {
  test("renders", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <History />
          </MemoryRouter>
        </Provider>
      );
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

      const nav = wrapper.find(UserNav);
      expect(nav.length).toBe(1);

      await wrapper.update();

      const price = await wrapper.find({ title: "price" });
      const paymentInfo = await wrapper.find(ShowPaymentInfo);
      expect(price.length).toBe(1);
      expect(price.text()).toBe("$1,049.99");
      expect(paymentInfo.length).toBe(1);
    });
  });
});
