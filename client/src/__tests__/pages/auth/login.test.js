import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import Login from "../../../pages/auth/Login";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../reducers";
const store = createStore(rootReducer);
import { Link } from "react-router-dom";

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

const history = {
  push: jest.fn(),
  location: {
    state: "test",
  },
};

const mockUser = {
  _id: "1515",
  role: "admin",
  cart: [],
  wishlist: [],
  email: "test@gmail.com",
  name: "test",
  token: "example123",
  address: { address: "123 Example St.", zip: 12345 },
  getIdTokenResult: () => Promise.resolve({ token: "example123" }),
};

jest.mock("../../../firebase.js", () => {
  const originalModule = jest.requireActual("../../../firebase.js");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    auth: {
      signInWithEmailAndPassword: () =>
        Promise.resolve({
          user: mockUser,
        }),
      signInWithPopup: () =>
        Promise.resolve({
          user: mockUser,
        }),
    },
  };
});

jest.mock("../../../utilities/auth", () => {
  const originalModule = jest.requireActual("../../../utilities/auth");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createOrUpdateUser: () => Promise.resolve({ data: { role: "admin" } }),
  };
});

moxios.install();

describe("Login", () => {
  test("render, onChanges, submit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login history={history} />
          </MemoryRouter>
        </Provider>
      );

      const emailInput = wrapper.find({ type: "email" });
      const pwInput = wrapper.find({ type: "password" });
      const submitBtn = wrapper.find({ title: "submit button" });
      const googleBtn = wrapper.find({ title: "google button" });
      const form = wrapper.find("form");
      const forgotPwLink = wrapper.find(Link);

      expect(emailInput.length).toBe(1);
      expect(pwInput.length).toBe(1);
      expect(submitBtn.length).toBe(1);
      expect(googleBtn.length).toBe(1);
      expect(form.length).toBe(1);
      expect(forgotPwLink.length).toBe(1);

      expect(forgotPwLink.props().to).toBe("/forgot/password");

      emailInput.simulate("change", { target: { value: "a" } });
      pwInput.simulate("change", { target: { value: "a" } });
      form.simulate("submit");
      googleBtn.simulate("click");
    });
  });
});
