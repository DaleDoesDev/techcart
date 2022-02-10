import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import sinon from "sinon";

import BrandCreate from "../../../../pages/admin/brand/BrandCreate";
import CategoryForm from "../../../../components/forms/CategoryForm";
import LocalSearch from "../../../../components/forms/LocalSearch";

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

const brand = { name: "test brand", slug: "test-brand", _id: "test123" };

jest.mock("../../../../utilities/brand", () => {
  const originalModule = jest.requireActual("../../../../utilities/brand");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getBrands: () =>
      Promise.resolve({
        data: [brand],
      }),
    getBrand: () =>
      Promise.resolve({
        data: {
          products: [
            {
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
            },
          ],
        },
      }),
    createBrand: () => Promise.resolve({ data: brand }),
  };
});

moxios.install();

describe("BrandCreate", () => {
  test("render, onChange, submit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <BrandCreate />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const categoryFormComponent = wrapper.find(CategoryForm);
      expect(categoryFormComponent.length).toBe(1);
      expect(wrapper.find(LocalSearch).length).toBe(1);
      expect(wrapper.find({ title: "brand link" }).at(0).props().to).toBe(
        "/admin/brand/test-brand"
      );

      const removeBtn = wrapper.find({ title: "remove brand" });
      expect(removeBtn.length).toBe(1);
      removeBtn.simulate("click");

      categoryFormComponent.props().handleSubmit({ preventDefault: jest.fn() });
    });
  });
});
