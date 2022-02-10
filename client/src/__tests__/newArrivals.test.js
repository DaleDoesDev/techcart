import React from "react";
import Enzyme, { mount } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import { Pagination } from "antd";

import { MemoryRouter } from "react-router-dom";

import { createStore } from "redux";
import { act } from "@testing-library/react";
import rootReducer from "../reducers";
const store = createStore(rootReducer);

import NewArrivals from "../components/home/NewArrivals";
import ProductCard from "../components/cards/ProductCard";

window.scrollTo = jest.fn();

const products = [
  {
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
  {
    subs: ["61be6cf697a7300771a1579e"],
    _id: 4748,
    sold: 0,
    images: [],
    colors: ["Green"],
    brand: "61be6cf697a7300771a157a3",
    category: "61be6cf697a7300771a15795",
    description: "<p>Short description</p>",
    price: 788.99,
    quantity: 2,
    ratings: [],
    slug: "dell-latitude-2000",
    title: "Dell Latitude 2000",
  },
];

jest.mock("../utilities/product", () => ({
  getProducts: () =>
    Promise.resolve({
      data: products,
    }),
  getProductsCount: () =>
    Promise.resolve({
      data: 1,
    }),
}));

describe("NewArrivals", () => {
  test("NewArrivals renders and pagination can be clicked", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <NewArrivals />
          </MemoryRouter>
        </Provider>
      );

      setImmediate(() => {
        wrapper.update();
        // within `setImmediate` all of the promises have been exhausted
        const paginationLink = wrapper.find(Pagination);
        const productComponents = wrapper.find(ProductCard);
        expect(productComponents.length).toBe(2);
        expect(paginationLink.length).toBe(1);
        paginationLink.props().onChange(1);
      });
    });
  });
});
