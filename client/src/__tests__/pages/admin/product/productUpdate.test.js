import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import ProductUpdate from "../../../../pages/admin/product/ProductUpdate";
import ProductUpdateForm from "../../../../components/forms/ProductUpdateForm";
import AdminNav from "../../../../components/nav/AdminNav";
import FileUpload from "../../../../components/forms/FileUpload";

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

// const assignMatchMedia = () => {
//   Object.defineProperty(window, "matchMedia", {
//     writable: true,
//     value: jest.fn().mockImplementation((query) => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: jest.fn(),
//       removeListener: jest.fn(),
//       addEventListener: jest.fn(),
//       removeEventListener: jest.fn(),
//       dispatchEvent: jest.fn(),
//     })),
//   });
// };

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
    getProduct: () =>
      Promise.resolve({
        data: product,
      }),
    updateProduct: () =>
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

describe("ProductUpdate", () => {
  test("render, updateForm fn(s)", async () => {
    //assignMatchMedia();
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <ProductUpdate
              history={history}
              match={{
                params: { id: 1, slug: "test-category" },
                isExact: true,
                path: "/category/test-category",
                url: "/category/test-category",
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const fileComponent = wrapper.find(FileUpload);
      const updateForm = wrapper.find(ProductUpdateForm);
      const adminNavComponent = wrapper.find(AdminNav);

      expect(fileComponent.length).toBe(1);
      expect(updateForm.length).toBe(1);
      expect(adminNavComponent.length).toBe(1);

      updateForm.props().handleCategoryChange({
        preventDefault: jest.fn(),
        target: { value: "test" },
      });

      updateForm.props().handleDescriptionChange("test");
      updateForm.props().handleChange({ target: { value: "test" } });
      updateForm
        .props()
        .handleSubmit({ preventDefault: jest.fn(), target: { value: "test" } });
    });
  });
});
