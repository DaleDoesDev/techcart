import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import { DeleteOutlined } from "@ant-design/icons";

import AdminProductCard from "../../components/cards/AdminProductCard"
import { MemoryRouter } from "react-router-dom";

const product = {
  subs: ["61be6cf697a7300771a1579e"],
  sold: 0,
  images: [
    {
      public_id: "1_nzkitk",
      url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638843854/ecomm_seeds/Dell_Latitude/1_nzkitk.jpg",
    },
  ],
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

let handleRemove = jest.fn();

const wrapper = mount(
  <MemoryRouter>
    <AdminProductCard product={product} handleRemove={handleRemove} />
  </MemoryRouter>
);

describe("AdminProductCard", () => {
  test("AdminProductCard rendered", () => {
    const card = wrapper.find("Card");
    expect(card.length).toBe(1);
  });
});

describe("AdminProductCard Edit Button", () => {
  const editProductBtn = wrapper.find("Link");
  test("Edit Product button rendered", () => {
    expect(editProductBtn.length).toBe(1);
  });
  test("Edit Product button click", () => {
    editProductBtn.simulate("click");
    expect(editProductBtn.props().to).toBe("/admin/product/dell-latitude-3000");
  });
});

describe("AdminProductCard Delete Button", () => {
  const deleteProductBtn = wrapper.find(DeleteOutlined);
  test("Delete Product button rendered", () => {
    expect(deleteProductBtn.length).toBe(1);
  });
  test("Delete Product button click", () => {
    deleteProductBtn.simulate("click");
    expect(handleRemove).toBeCalledWith("dell-latitude-3000");
  });
});
