import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import CategoryHome from "../../../pages/category/CategoryHome";
import ProductCard from "../../../components/cards/ProductCard";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../reducers";
const store = createStore(rootReducer);

import { act, waitFor } from "@testing-library/react";
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
    count: 1,
  },
];

jest.mock("../../../utilities/category", () => {
  const originalModule = jest.requireActual("../../../utilities/category");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getCategory: () =>
      Promise.resolve({
        data: {
          category: {
            name: "test-category",
          },
          products,
        },
      }),
  };
});

moxios.install();

describe("CategoryHome", () => {
  test("renders", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <CategoryHome
              match={{
                params: { id: 1, slug: "test-subcategory" },
                isExact: true,
                path: "/sub/test-subcategory",
                url: "/sub/test-subcategory",
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => moxios.wait(function () {}));
      wrapper.update();

      const header = wrapper.find({ title: "category header" });
      expect(header.length).toBe(1);
      expect(header.text()).toBe('1 products in category "test-category"');
      const productCardComponent = wrapper.find(ProductCard);
      expect(productCardComponent.length).toBe(1);
    });
  });
});
