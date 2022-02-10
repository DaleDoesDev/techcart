import React from 'react'
import {waitFor} from '@testing-library/react'
import { Provider } from "react-redux"
import { createStore } from "redux";

import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import { MemoryRouter } from 'react-router-dom';
import moxios from 'moxios'
import SingleProduct from '../../components/cards/SingleProduct'
import rootReducer from "../../reducers";
import { Tooltip } from "antd";
import { setLocalCart } from "../../testing_utils/setLocalCart"

  moxios.install()
  window.scrollTo = jest.fn();

  const store = createStore(rootReducer);
  const product = {
    subs: ["61be6cf697a7300771a1579e"],
    sold: 0,
    images: [{
      public_id: "3_hyflzl",
      url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163056/ecomm_seeds/Dell_G15/3_hyflzl.jpg",
    }],
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

  setLocalCart();

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <SingleProduct 
        product={product}
        />
      </MemoryRouter>
    </Provider>
  );

  //await utility functions when <Provider> renders the whole app.
  beforeEach(async () => {
    await waitFor(() => moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: product
      })
    }))
  })
   //
  describe("singleProduct", () => {
    const cartBtn = wrapper.find(Tooltip);
    const originalUseState = React.useState;
    const mockSetTooltip = jest.fn();
    React.useState = () => ["", mockSetTooltip];

    afterAll(() => {
      React.useState = originalUseState;
    });

    test("cartBtn renders", async () => {
      expect(cartBtn.length).toBe(1);
      expect(cartBtn.text()).toBe("  Add to Cart");
    });

    test("Btn renders in-stock status", () => {
      //the below indicates the item is not 'out of stock'
      expect(cartBtn.props().title).toBe("Click to Add");
    });

    test("cartBtn clicked", async () => {
      const store = createStore(rootReducer);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <SingleProduct 
            product={product}
            />
          </MemoryRouter>
        </Provider>
      );
    
      const nestedBtn = wrapper.find("[data-type='test']");
      nestedBtn.simulate("click");
      expect(store.getState().cart.length).toBe(2);
      expect(mockSetTooltip).toHaveBeenCalledWith("Added");
    });

    test("cartBtn clicked (out-of-stock)", async () => {
      const store = createStore(rootReducer);
      
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <SingleProduct 
            product={{
              ...product,
              quantity: 0,
            }}
            />
          </MemoryRouter>
        </Provider>
      );
    
      const nestedBtn = wrapper.find("[data-type='test']");
      
      nestedBtn.simulate("click");
      expect(store.getState().cart.length).toBe(0);
      expect(mockSetTooltip).not.toHaveBeenCalledWith("Added");
    });
})

describe("wishlist btn", () => {
  const btn = wrapper.find({ title: 'wishlist' });
  it("renders", () => {
    expect(btn.length).toBe(1);
    expect(btn.text()).toBe("Add to Wishlist");
  })
  it("button click (moxios)", () => {
    //a user is needed
    store.dispatch({
      type: "LOGGED_IN_USER",
      payload: {
        token: 234
      }
    })
    btn.simulate("click");
  })
})
