import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import RegisterComplete from "../../../pages/auth/RegisterComplete";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

const history = {
  push: jest.fn(),
};

window.localStorage.setItem("emailForRegistration", "test@ex.com");
window.localStorage.removeItem = jest.fn();

jest.mock("../../../firebase.js", () => {
  const originalModule = jest.requireActual("../../../firebase.js");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    auth: {
      signInWithEmailLink: () =>
        Promise.resolve({
          user: {
            emailVerified: true,
          },
        }),
      currentUser: {
        updatePassword: () => Promise.resolve({ ok: true }),
        getIdTokenResult: () => Promise.resolve("test123"),
      },
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

describe("RegisterComplete", () => {
  test("render, onChange, submit", async () => {
    await act(async () => {
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <RegisterComplete history={history} />
          </MemoryRouter>
        </Provider>
      );

      const emailInput = wrapper.find({ type: "email" });
      const pwInput = wrapper.find({ type: "password" });
      const form = wrapper.find("form");

      expect(emailInput.length).toBe(1);
      expect(pwInput.length).toBe(1);
      expect(form.length).toBe(1);

      form.simulate("submit"); //submit without email/password first

      emailInput.simulate("change", { target: { value: "test@example.com" } });
      pwInput.simulate("change", { target: { value: "t" } });
      form.simulate("submit"); //submit with short password

      pwInput.simulate("change", { target: { value: "testing2022" } });
      form.simulate("submit"); //submit with correct information
    });
  });
});
