import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import { Link } from "react-router-dom";

import CategoryCreate from "../../../../pages/admin/category/CategoryCreate";
import AdminNav from "../../../../components/nav/AdminNav";
import CategoryForm from "../../../../components/forms/CategoryForm";
import LocalSearch from "../../../../components/forms/LocalSearch";
import sinon from "sinon";
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
        data: [],
      }),
    removeCategory: () =>
      Promise.resolve({
        data: [],
      }),
  };
});

moxios.install();

// afterEach(async () => {
//   await moxios.wait(function () {
//     let request = moxios.requests.mostRecent();
//     console.log(moxios.requests);
//     request.respondWith(Promise.resolve([]));
//   });
// });

describe("categoryCreate", () => {
  test("render", async () => {
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

      const adminNavComponent = wrapper.find(AdminNav);
      const categoryFormComponent = wrapper.find(CategoryForm);
      const localSearchComponent = wrapper.find(LocalSearch);
      const categoryLink = wrapper.find(Link).last();
      const removeBtn = wrapper.find({ title: "remove" });

      expect(adminNavComponent.length).toBe(1);
      expect(categoryFormComponent.length).toBe(1);
      expect(localSearchComponent.length).toBe(1);
      expect(categoryLink.props().to).toBe("/admin/category/test-category");
      expect(removeBtn.length).toBe(1);

      categoryFormComponent.props().handleSubmit({ preventDefault: jest.fn() });
      removeBtn.simulate("click");
    });
  });
});
