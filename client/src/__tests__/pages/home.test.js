import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";
import { MemoryRouter } from "react-router-dom";

import NewArrivals from "../../components/home/NewArrivals";
import BestSellers from "../../components/home/BestSellers";
import CategoryList from "../../components/category/CategoryList";
import SubList from "../../components/sub/SubList";

import { waitFor } from "@testing-library/react";
window.scrollTo = jest.fn();

import Home from "../../pages/Home";

moxios.install();
const wrapper = mount(
  <MemoryRouter>
    <Home />
  </MemoryRouter>
);

afterEach(async () => {
  await waitFor(() =>
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          ok: true,
        },
      });
    })
  );
});

describe("Home", () => {
  test("renders", async () => {
    expect(wrapper.find(NewArrivals).length).toBe(1);
    expect(wrapper.find(BestSellers).length).toBe(1);
    expect(wrapper.find(CategoryList).length).toBe(1);
    expect(wrapper.find(SubList).length).toBe(1);
  });
});
