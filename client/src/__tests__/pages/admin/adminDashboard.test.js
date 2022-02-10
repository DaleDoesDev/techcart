import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import AdminDashboard from "../../../pages/admin/AdminDashboard";
import AdminNav from "../../../components/nav/AdminNav";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

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
      name: "test",
      email: "test@gmail.com",
      address: { address: "123 Example st.", zip: 23454 },
    },
  },
];

jest.mock("../../../utilities/admin", () => {
  const originalModule = jest.requireActual("../../../utilities/admin");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getOrders: () =>
      Promise.resolve({
        data: orders,
      }),
    changeStatus: () =>
      Promise.resolve({
        data: "",
      }),
  };
});

moxios.install();

describe("AdminDashboard", () => {
  test("render, handleStatusChange", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AdminDashboard />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});

      const ordersComponent = wrapper.find({ title: "orders" });
      const adminNavComponent = wrapper.find(AdminNav);
      expect(ordersComponent.length).toBe(1);
      expect(adminNavComponent.length).toBe(1);

      ordersComponent.props().handleStatusChange("4353", "Pending");
    });
  });
});
