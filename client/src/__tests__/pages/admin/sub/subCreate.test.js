import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import sinon from "sinon";

import SubCreate from "../../../../pages/admin/sub/SubCreate";
import AdminNav from "../../../../components/nav/AdminNav";
import CategoryForm from "../../../../components/forms/CategoryForm";

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

const sub = { name: "test sub", slug: "test-sub", _id: 7856 };
const category = { name: "test category", slug: "test-category", _id: 4832 };

jest.mock("../../../../utilities/sub", () => {
  const originalModule = jest.requireActual("../../../../utilities/sub");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getSubs: () =>
      Promise.resolve({
        data: [sub],
      }),
    getSub: () =>
      Promise.resolve({
        data: { sub, products: [] },
      }),
    removeSub: () =>
      Promise.resolve({
        data: { ok: true },
      }),
    createSub: () =>
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

describe("SubCreate", () => {
  test("render, onClick, onChange, handleSubmit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <SubCreate />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const categorySelect = wrapper.find({ name: "category" });
      expect(categorySelect.length).toBe(1);
      categorySelect.simulate("change", { target: { value: category } });

      const categoryOption = wrapper.find({ title: "category option" });
      const subLink = wrapper.find({ title: "link to subcategory" }).at(0);
      const adminNavComponent = wrapper.find(AdminNav);
      const categoryFormComponent = wrapper.find(CategoryForm);
      const deleteBtn = wrapper.find({ title: "remove subcategory" });

      expect(categoryOption.length).toBe(1);
      expect(categoryOption.text()).toBe("test category");
      expect(subLink.props().to).toBe("/admin/sub/test-sub");
      expect(adminNavComponent.length).toBe(1);
      expect(categoryFormComponent.length).toBe(1);
      expect(deleteBtn.length).toBe(1);


      deleteBtn.simulate("click");
      categoryFormComponent.props().handleSubmit({ preventDefault: jest.fn() });
    });
  });
});
