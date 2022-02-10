import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import moxios from "moxios";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../reducers";
const store = createStore(rootReducer);

import { act, waitFor } from "@testing-library/react";

window.scrollTo = jest.fn();

const mockProduct = {
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
  ratings: [
    {
      star: 4,
      postedBy: 1515,
    },
  ],
  slug: "dell-latitude-3000",
  title: "Dell Latitude 3000",
  count: 1,
};

jest.mock("../../utilities/product", () => {
  const originalModule = jest.requireActual("../../utilities/product");
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    productStar: () => Promise.resolve({ data: { ok: true } }),
  };
});

store.dispatch({
  type: "LOGGED_IN_USER",
  payload: {
    _id: 1515,
    role: "admin",
    cart: [],
    wishlist: [],
    email: "test@gmail.com",
    name: "test",
    token: "example123",
    address: { address: "123 Example St.", zip: 12345 },
  },
});

import Product from "../../pages/Product";
import SingleProduct from "../../components/cards/SingleProduct";

moxios.install();

beforeEach(async () => {
  await waitFor(() =>
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockProduct,
      });
    })
  );
});

describe("Product", () => {
  test("renders", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Product
              match={{
                params: { id: 1, slug: "dell-latitude-3000" },
                isExact: true,
                path: "/product/dell-latitude-3000",
                url: "/product/dell-latitude-3000",
              }}
            />
          </MemoryRouter>
        </Provider>
      );
      const singleProductComponent = wrapper.find(SingleProduct);
      expect(singleProductComponent.length).toBe(1);
      //singleProductComponenet.props().onStarClick();
    });
  });
  test("SingleProduct onStarClick", async () => {
    await act(async () => {
      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <Product
              match={{
                params: { id: 1, slug: "dell-latitude-3000" },
                isExact: true,
                path: "/product/dell-latitude-3000",
                url: "/product/dell-latitude-3000",
              }}
            />
          </MemoryRouter>
        </Provider>
      );
      const singleProductComponent = wrapper.find(SingleProduct);
      singleProductComponent.props().onStarClick();
    });
  });
});
