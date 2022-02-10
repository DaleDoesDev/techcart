import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import sinon from "sinon";

import AllProducts from "../../../../pages/admin/product/AllProducts";
import AdminNav from "../../../../components/nav/AdminNav";
import AdminProductCard from "../../../../components/cards/AdminProductCard";
import { Pagination } from "antd";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();
const confirmStub = sinon.stub(global, "confirm");
confirmStub.returns(true);

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

jest.mock("../../../../utilities/product", () => {
  const originalModule = jest.requireActual("../../../../utilities/product");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getProducts: () =>
      Promise.resolve({
        data: [product],
      }),
    getProductsCount: () =>
      Promise.resolve({
        data: 1,
      }),
    removeProduct: () =>
      Promise.resolve({
        data: { ok: true },
      }),
  };
});

moxios.install();

describe("AllProducts", () => {
  test("render, onChange, handleRemove", async () => {
    assignMatchMedia();
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AllProducts />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const paginationComponent = wrapper.find(Pagination);
      const adminProductComponent = wrapper.find(AdminProductCard);
      const adminNavComponent = wrapper.find(AdminNav);

      expect(paginationComponent.length).toBe(1);
      expect(adminProductComponent.length).toBe(1);
      expect(adminNavComponent.length).toBe(1);

      adminProductComponent.props().handleRemove();
      paginationComponent.props().onChange(1);
    });
  });
});
