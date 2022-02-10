import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import SubUpdate from "../../../../pages/admin/sub/SubUpdate";
import AdminNav from "../../../../components/nav/AdminNav";
import CategoryForm from "../../../../components/forms/CategoryForm";

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

const sub = {
  name: "test sub",
  slug: "test-sub",
  parent: "test-parent",
  _id: 7856,
};

const category = { name: "test category", slug: "test-category", _id: 4832 };

jest.mock("../../../../utilities/sub", () => {
  const originalModule = jest.requireActual("../../../../utilities/sub");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getSub: () =>
      Promise.resolve({
        data: sub,
      }),
    updateSub: () =>
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
  };
});

moxios.install();

describe("SubUpdate", () => {
  test("render, onChange, submit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <SubUpdate
              history={history}
              match={{
                params: { id: 1, slug: "test-sub" },
                isExact: true,
                path: "/sub/test-sub",
                url: "/sub/test-sub",
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const parentSelect = wrapper.find({ title: "parent category" });
      const categoryOption = wrapper.find({ title: "category option" });
      const adminNavComponent = wrapper.find(AdminNav);
      const categoryFormComponent = wrapper.find(CategoryForm);

      expect(parentSelect.length).toBe(1);
      expect(categoryOption.text()).toBe("test category");
      expect(adminNavComponent.length).toBe(1);
      expect(categoryFormComponent.length).toBe(1);

      parentSelect.simulate("change", { target: { value: "test parent" } });
      categoryFormComponent.props().handleSubmit({ preventDefault: jest.fn() });
    });
  });
});
