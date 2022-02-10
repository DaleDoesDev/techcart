import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../reducers";
const store = createStore(rootReducer);

import { act, waitFor } from "@testing-library/react";

window.scrollTo = jest.fn();

const assignMatchMedia = () => {
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
};

const mockProduct = {
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
};

jest.mock("../../utilities/brand", () => {
  const originalModule = jest.requireActual("../../utilities/brand");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getBrands: () =>
      Promise.resolve({ data: [{ name: "test-brand", _id: 2343 }] }),
  };
});

jest.mock("../../utilities/sub", () => {
  const originalModule = jest.requireActual("../../utilities/sub");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getSubs: () => Promise.resolve({ data: [{ name: "test-sub", _id: 8686 }] }),
  };
});

jest.mock("../../utilities/category", () => {
  const originalModule = jest.requireActual("../../utilities/category");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getCategories: () =>
      Promise.resolve({ data: [{ name: "test-category", _id: 5322 }] }),
  };
});

jest.mock("../../utilities/product", () => {
  const originalModule = jest.requireActual("../../utilities/product");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getProductsCount: () => Promise.resolve({ data: 1 }),
    getProducts: () => Promise.resolve({ data: [mockProduct] }),
  };
});

import Shop from "../../pages/Shop";
import Star from "../../components/forms/StarFilter";
import { Checkbox } from "antd";

moxios.install();

beforeEach(async () => {
  await waitFor(() =>
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [mockProduct],
      });
    })
  );
});

jest.useFakeTimers();

describe("Shop", () => {
  test("starClick, sub, color onClick fn(s)", async () => {
    await act(async () => {
      assignMatchMedia();
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );
      const starComponent = wrapper.find(Star).at(0);
      expect(starComponent.props().numberOfStars).toBe(5);
      await starComponent.props().starClick();

      await wrapper.update();
      const sub = wrapper.find({ title: "subcategory" }).at(0);
      expect(sub.props().title).toBe("subcategory");
      sub.props().onClick();

      const color = wrapper.find({ title: "color" }).at(0);
      expect(color.props().value).toBe("Black");
      color.props().onChange({ target: { value: "Green" } });
    });
  });

  test("pagination, category, brand onChange(s)", async () => {
    await act(async () => {
      assignMatchMedia();
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() =>
        moxios.wait(function () {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: [mockProduct],
          });
        })
      );

      await wrapper.update();
      const paginationComponent = wrapper.find("nav");
      const category = wrapper.find(Checkbox).at(0);
      const brand = wrapper.find({ title: "brand" }).at(0);
      const price = wrapper.find({ title: "price slider" }).at(0);

      expect(paginationComponent.length).toBe(1);
      expect(brand.props().name.name).toBe("test-brand");
      expect(category.props().value).toBe(5322);
      expect(price.props().value).toStrictEqual([0, 0]); //default price range

      paginationComponent.children().props().onChange(1);
      category.props().onChange({ target: { value: 5322 } });
      brand.props().onChange({ target: { value: 2343 } });
      price.props().onChange([0, 999]);
      jest.runAllTimers();

      await store.dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "test query" },
      });
      jest.runAllTimers();
    });
  });

  test("text query", async () => {
    await act(async () => {
      assignMatchMedia();

      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      await store.dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "test query" },
      });
      jest.runAllTimers();
    });
  });
});
