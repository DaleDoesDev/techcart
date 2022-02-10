import { Provider } from "react-redux"
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import {waitFor} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';

import {CloseOutlined} from '@ant-design/icons'
import moxios from 'moxios'
import { createStore } from "redux";
import rootReducer from "../../reducers";
const store = createStore(rootReducer);
import { setLocalCart } from "../../testing_utils/setLocalCart";

import ProductCardCheckout from "../../components/cards/ProductCardCheckout";

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

setLocalCart();
moxios.install()

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <table>
        <ProductCardCheckout p={product}/>
        </table>
        </MemoryRouter>
    </Provider>
  );

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

describe("ProductCardCheckout count input", () => {
  const inputBtn = wrapper.find('input')
 test("ProductCardCheckout rendered", () => {
   expect(inputBtn.length).toBe(1);
 }); 

 test("ProductCardCheckout update input", () => {
    inputBtn.simulate('change', { target: { value: 1 } })
 });

 test("ProductCardCheckout update (quantity too high)", () => {
    inputBtn.simulate('change', { target: { value: 111 } })
 });
});

describe("ProductCardCheckout remove btn", () => {
  const removeBtn = wrapper.find(CloseOutlined)
  test("remove btn rendered", () => {
    expect(removeBtn.length).toBe(1);
  });
  test("remove btn clicked", () => {
    removeBtn.simulate('click')
  });
});

describe("ProductCardCheckout selectedColor", () => {
  const selectBtn = wrapper.find('select')
  test("remove btn rendered", () => {
    expect(selectBtn.length).toBe(1);
  });

  test("selectBtn clicked", () => {
    selectBtn.prop('onChange')({target: { value: ['val' ] }})
  });
});
