import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import ForgotPassword from "../../../pages/auth/ForgotPassword";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

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

const history = {
  push: jest.fn(),
};

jest.mock("../../../firebase.js", () => {
  const originalModule = jest.requireActual("../../../firebase.js");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    auth: {
      sendPasswordResetEmail: () =>
        Promise.resolve({
          data: {
            ok: true,
          },
        }),
    },
  };
});

moxios.install();

describe("ForgotPassword", () => {
  test("render, email onChange, form onSubmit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <ForgotPassword history={history} />
          </MemoryRouter>
        </Provider>
      );

      const emailInput = wrapper.find({ type: "email" });
      const form = wrapper.find("form");

      expect(emailInput.length).toBe(1);
      expect(form.length).toBe(1);
      emailInput.simulate("change", { target: { value: "a" } });
      form.simulate("submit");
    });
  });
});
