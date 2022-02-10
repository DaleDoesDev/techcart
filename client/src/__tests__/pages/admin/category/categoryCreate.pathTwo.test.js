import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import CategoryCreate from "../../../../pages/admin/category/CategoryCreate";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

const category = {
  name: "test category",
  slug: "test-category",
  _id: "test123",
};

jest.mock("../../../../utilities/category", () => {
  const originalModule = jest.requireActual("../../../../utilities/category");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getCategories: () =>
      Promise.resolve({
        data: [category],
      }),
    getCategory: () =>
      Promise.resolve({
        data: {
          products: [],
          category,
        },
      }),
    createCategory: () =>
      Promise.resolve({
        data: [category],
      }),
    getCategorySubs: () =>
      Promise.resolve({
        data: [{ name: "testSub" }],
      }),
  };
});

moxios.install();

describe("categoryCreate path two", () => {
  test("submit (no products matching a category)", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <CategoryCreate />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const removeBtn = wrapper.find({ title: "remove" });
      expect(removeBtn.length).toBe(1);
      removeBtn.simulate("click");
    });
  });
});
