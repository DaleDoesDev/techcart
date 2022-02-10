import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import sinon from "sinon";

import BrandCreate from "../../../../pages/admin/brand/BrandCreate";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../../reducers";
const store = createStore(rootReducer);

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

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();
const confirmStub = sinon.stub(global, "confirm");
confirmStub.returns(true);

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
          products: [],
        },
      }),
    createBrand: () => Promise.resolve({ data: brand }),
    removeBrand: () => Promise.resolve({ data: brand }),
  };
});

moxios.install();

describe("BrandCreate path two", () => {
  test("render", async () => {
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

      const removeBtn = wrapper.find({ title: "remove brand" });
      expect(removeBtn.length).toBe(1);
      removeBtn.simulate("click");
    });
  });
});
