import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import sinon from "sinon";

import CreateCouponPage from "../../../../pages/admin/coupon/CreateCouponPage";
import AdminNav from "../../../../components/nav/AdminNav";
import DatePicker from "react-datepicker";
import { DeleteOutlined } from "@ant-design/icons";

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

const coupon = { name: "test coupon", slug: "test-coupon", _id: 5464 };

jest.mock("../../../../utilities/coupon", () => {
  const originalModule = jest.requireActual("../../../../utilities/coupon");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getCoupons: () =>
      Promise.resolve({
        data: [coupon],
      }),
    removeCoupon: () =>
      Promise.resolve({
        data: { ok: true },
      }),
    createCoupon: () =>
      Promise.resolve({
        data: { ok: true },
      }),
  };
});

moxios.install();

describe("createCoupon", () => {
  test("render, onChange, onClick, onSubmit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <CreateCouponPage />
          </MemoryRouter>
        </Provider>
      );

      await moxios.wait(function () {});
      await wrapper.update();

      const dateComponent = wrapper.find(DatePicker);
      const discount = wrapper.find({ name: "Discount" });
      const name = wrapper.find({ title: "Please enter the coupon's name." });
      const adminNavComponent = wrapper.find(AdminNav);
      const form = wrapper.find("form");
      const deleteBtn = wrapper.find(DeleteOutlined);

      expect(dateComponent.length).toBe(1);
      expect(discount.length).toBe(1);
      expect(name.length).toBe(1);
      expect(adminNavComponent.length).toBe(1);
      expect(form.length).toBe(1);
      expect(deleteBtn.length).toBe(1);

      dateComponent.props().onChange(Date.now());
      discount.simulate("change", { target: { value: 15 } });
      name.simulate("change", { target: { value: "test" } });
      form.simulate("submit");

      deleteBtn.simulate("click");
    });
  });
});
