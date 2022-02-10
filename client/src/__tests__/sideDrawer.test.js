import React from "react";
import { Provider } from "react-redux"
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from 'moxios'
import {waitFor} from '@testing-library/react'
import { Drawer } from "antd";

import { createStore } from "redux";
import rootReducer from "../reducers";
const store = createStore(rootReducer);

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
};

store.dispatch({
  type: "ADD_TO_CART",
  payload: [
    product
  ]
})

import SideDrawer from "../components/drawer/SideDrawer"; 

moxios.install();
const wrapper = mount(
  <Provider store={store}>
      <SideDrawer />
  </Provider>
)

afterEach(async () => {
  await waitFor(() => moxios.wait(function () {
    let request = moxios.requests.mostRecent()
    request.respondWith({
      status: 200,
      response: {
        data: {}
      }
    })
  }))
})

describe("SideDrawer", () => {
  const drawerComponent = wrapper.find(Drawer);
  test("renders", async () => {
  expect(drawerComponent.props().title).toBe('Cart (1)')
  })

  test("SideDrawer can be closed", () => {
    drawerComponent.props().onClose();
  })
})