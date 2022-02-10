import React from "react";
import Enzyme, { mount } from "enzyme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import rootReducer from "../../reducers";
import ProductCard from "../../components/cards/ProductCard";
import ScrollToTop from "../../components/ScrollToTop";
import { MemoryRouter } from "react-router-dom";
import { Tooltip } from "antd";

const store = createStore(rootReducer);
const product = {
  subs: ["61be6cf697a7300771a1579e"],
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

window.scrollTo = jest.fn();
const wrapper = mount(
  <Provider store={store}>
    <MemoryRouter>
      <ScrollToTop />
      <ProductCard product={product} />
    </MemoryRouter>
  </Provider>
);

describe("ProductCard 'View Product' button", () => {
  const viewProductBtn = wrapper.find("Link");
  test("View Product button rendered", () => {
    expect(viewProductBtn.length).toBe(1);
    expect(viewProductBtn.text()).toBe("  View Product");
  });

  test("Click to view product (url updates)", () => {
    viewProductBtn.simulate("click");
    expect(viewProductBtn.props().to).toBe("/product/dell-latitude-3000");
  });
});

describe("ProductCard 'Add to Cart' button", () => {
  const addToCartBtn = wrapper.find(Tooltip);
  const originalUseState = React.useState;
  const mockSetTooltip = jest.fn();
  React.useState = () => ["", mockSetTooltip];

  afterAll(() => {
    React.useState = originalUseState;
  });

  test("Add-to-Cart button rendered", () => {
    expect(addToCartBtn.length).toBe(1);
    expect(addToCartBtn.text()).toBe("  Add to Cart");
  });

  test("Btn renders in-stock status", () => {
    //the below indicates the item is not 'out of stock'
    expect(addToCartBtn.props().title).toBe("Click to Add");
  });

  test("Add to Cart button clicked", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ScrollToTop />
          <ProductCard product={product} />
        </MemoryRouter>
      </Provider>
    );
    const btn = wrapper.find("[data-type='test']");
    btn.simulate("click");

    expect(store.getState().cart.length).toBe(1);
    expect(mockSetTooltip).toHaveBeenCalledWith("Added");
  });

  test("Add-to-Cart click (out of stock)", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ScrollToTop />
          <ProductCard
            product={{
              ...product,
              quantity: 0,
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    const btn = wrapper.find("[data-type='test']");
    btn.simulate("click");
    expect(mockSetTooltip).not.toHaveBeenCalled();
  });

  test("Add-to-Cart click (duplicate product)", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ScrollToTop />
          <ProductCard product={product} />
        </MemoryRouter>
      </Provider>
    );

    const btn = wrapper.find("[data-type='test']");
    btn.simulate("click");
    expect(mockSetTooltip).toHaveBeenCalledWith(
      "This item is already in the cart"
    );
  });
});

describe("Product ratings", () => {
  test("Product ratings render 3 star rating", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ScrollToTop />
          <ProductCard
            product={{
              ...product,
              quantity: 0,
              ratings: [{ star: 3, postedBy: "24353" }],
            }}
          />
        </MemoryRouter>
      </Provider>
    );
    const ratings = wrapper.find("[data-type='rate']");
    expect(ratings.length).toBe(1);
    expect(ratings.props().rating).toBe(3);
  });
});
