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

import Wishlist from "../../../pages/user/Wishlist";

import { act, waitFor } from "@testing-library/react";
window.scrollTo = jest.fn();

const wishlist = [
  {
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
    ratings: [
      {
        star: 4,
        postedBy: 1515,
      },
    ],
    slug: "dell-latitude-3000",
    title: "Dell Latitude 3000",
    count: 1,
  },
];

jest.mock("../../../utilities/user", () => {
  const originalModule = jest.requireActual("../../../utilities/user");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getWishlist: () =>
      Promise.resolve({
        data: {
          wishlist,
        },
      }),
    removeFromWishlist: () =>
      Promise.resolve({
        data: {
          ok: true,
        },
      }),
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

describe("wishlist", () => {
  test("render, removeBtn onClick", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Wishlist />
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

      const header = wrapper.find({ title: "header" });
      expect(header.length).toBe(1);

      await wrapper.update();

      const linkComponent = wrapper.find({ title: "product link" }).at(0);
      expect(linkComponent.text()).toBe("Dell Latitude 3000");
      expect(linkComponent.props().to).toBe("/product/dell-latitude-3000");

      const removeBtn = wrapper.find({ title: "remove" });
      expect(removeBtn.length).toBe(1);
      removeBtn.simulate("click");
    });
  });
});
