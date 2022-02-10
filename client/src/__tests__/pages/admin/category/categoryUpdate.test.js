import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import CategoryUpdate from "../../../../pages/admin/category/CategoryUpdate";
import CategoryForm from "../../../../components/forms/CategoryForm";
import AdminNav from "../../../../components/nav/AdminNav";

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
    updateCategory: () =>
      Promise.resolve({
        data: "",
      }),
    getCategory: () =>
      Promise.resolve({
        data: category,
      }),
  };
});

moxios.install();

describe("categoryUpdate", () => {
  test("render", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <CategoryUpdate
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

      const categoryFormComponent = wrapper.find(CategoryForm);
      const adminNavComponent = wrapper.find(AdminNav);
      expect(categoryFormComponent.length).toBe(1);
      expect(adminNavComponent.length).toBe(1);

      categoryFormComponent.props().handleSubmit({ preventDefault: jest.fn() });
    });
  });
});
