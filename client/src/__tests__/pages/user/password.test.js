import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import { MemoryRouter } from "react-router-dom";

import Password from "../../../pages/user/Password";

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

jest.mock("../../../firebase.js", () => {
  const originalModule = jest.requireActual("../../../firebase.js");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    auth: {
      currentUser: {
        updatePassword: () =>
          Promise.resolve({
            data: {
              ok: true,
            },
          }),
      },
    },
  };
});

moxios.install();

const wrapper = mount(
  <MemoryRouter>
    <Password />
  </MemoryRouter>
);

describe("Password", () => {
  const form = wrapper.find("form");
  const passwordInput = wrapper.find({ type: "password" });
  test("renders", async () => {
    expect(form.length).toBe(1);
    expect(passwordInput.length).toBe(1);
  });
  test("password onChange, form onSubmit", async () => {
    passwordInput.simulate("change", { target: { value: "a" } });
    await act(async () => {
      await form.simulate("submit");
    });
  });
});
