import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import ProductCreate from "../../../../pages/admin/product/ProductCreate";
import AdminNav from "../../../../components/nav/AdminNav";
import ProductCreateForm from "../../../../components/forms/ProductCreateForm";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

const history = {
  push: jest.fn(),
};

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

const brand = { name: "test-brand", slug: "test-brand", _id: 2906 };
const category = { name: "test-category", slug: "test-category", _id: 4483 };
const sub = { name: "test-sub", slug: "test-sub", _id: 8886 };

jest.mock("../../../../utilities/brand", () => {
  const originalModule = jest.requireActual("../../../../utilities/brand");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getBrands: () =>
      Promise.resolve({
        data: [brand],
      }),
  };
});

jest.mock("../../../../utilities/product", () => {
  const originalModule = jest.requireActual("../../../../utilities/product");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createProduct: () =>
      Promise.resolve({
        data: { ok: true },
      }),
  };
});

jest.mock("../../../../utilities/category", () => {
  const originalModule = jest.requireActual("../../../../utilities/category");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getCategories: () =>
      Promise.resolve({
        data: [category],
      }),
    getCategorySubs: () =>
      Promise.resolve({
        data: [sub],
      }),
  };
});

moxios.install();

describe("ProductCreate", () => {
  test("render, productCreateComponent fn(s)", async () => {
    assignMatchMedia();
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <ProductCreate history={history} />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const productCreateComponent = wrapper.find(ProductCreateForm);
      const adminNavComponent = wrapper.find(AdminNav);

      expect(productCreateComponent.length).toBe(1);
      expect(adminNavComponent.length).toBe(1);

      productCreateComponent
        .props()
        .handleChange({ target: { value: "test" } });
      productCreateComponent.props().handleCategoryChange({
        preventDefault: jest.fn(),
        target: { value: "test" },
      });
      productCreateComponent
        .props()
        .handleSubmit({ preventDefault: jest.fn() });
    });
  });
});
