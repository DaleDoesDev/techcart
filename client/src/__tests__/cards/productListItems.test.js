import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import { MemoryRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import ProductListItems from "../../components/cards/ProductListItems";

const product = {
  subs: [{
    slug: 'test',
    name: 'test'
  }],
  sold: 0,
  images: [],
  colors: ["Black", "Green"],
  brand: "61be6cf697a7300771a157a3",
  category: {
    slug: 'test',
    name: 'test'
  },
  description: "<p>Short HTML description</p>",
  price: "1049.99",
  quantity: 25,
  ratings: [],
  slug: "dell-latitude-3000",
  title: "Dell Latitude 3000",
};
const wrapper = mount(
  <MemoryRouter>
    <ProductListItems product={product} />
  </MemoryRouter>
);

describe("ProductListItems", () => {
  const categoryLink = wrapper.find(Link).at(0);
  const subLink = wrapper.find(Link).at(1);

  test("categoryLink renders", () => { 
    expect(categoryLink.length).toBe(1)
  });
  test("categoryLink click", () => { 
    categoryLink.simulate("click")
    expect(categoryLink.props().to).toBe('/category/test');
  });

  test("subLink renders", () => { 
    expect(subLink.length).toBe(1)
  });
  test("subLink click", () => { 
    subLink.simulate("click")
    expect(subLink.props().to).toBe('/sub/test');
  });
});
