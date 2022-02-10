import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import { Menu, Badge } from "antd";

import Header from "../components/nav/Header";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../reducers";
const store = createStore(rootReducer);

import { act } from "@testing-library/react";
window.scrollTo = jest.fn();

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

const product = {
  subs: ["61be6cf697a7300771a1579e"],
  _id: 3456,
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
};

store.dispatch({
  type: "LOGGED_IN_USER",
  payload: mockUser,
});

store.dispatch({
  type: "ADD_TO_CART",
  payload: [product],
});

jest.mock("../firebase.js", () => {
  const originalModule = jest.requireActual("../firebase.js");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    auth: {
      signOut: () =>
        Promise.resolve({
          user: "",
        }),
      signInWithEmailAndPassword: () =>
        Promise.resolve({
          user: mockUser,
        }),
    },
  };
});

import { auth } from "../firebase";

moxios.install();

describe("Header", () => {
  test("render, onClick, logout", async () => {
    await act(async () => {
      await auth.signInWithEmailAndPassword("re@fd.co", "tester");
      let wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </Provider>
      );

      const menuComponent = wrapper.find(Menu);
      const badgeComponent = wrapper.find(Badge);
      const registerLink = wrapper.find({ title: "register" });
      const logoutLink = wrapper.find({ title: "logout" }).at(0);

      expect(menuComponent.length).toBe(1);
      expect(badgeComponent.length).toBe(1);
      expect(badgeComponent.props().count).toBe(1);
      expect(registerLink.length).toBe(0); //shouldn't be rendered if logged in
      expect(logoutLink.length).toBe(1);

      menuComponent.props().onClick({ key: "" });
      logoutLink.props().onClick({ key: "" });
    });
  });
});
