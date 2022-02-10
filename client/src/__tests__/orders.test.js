import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import Orders from "../components/order/Orders"; 
import ShowPaymentInfo from "../components/cards/ShowPaymentInfo";

const handleStatusChange = jest.fn();

const orders = [{
  _id: "61be6d8858012c077af1c68f",
  orderStatus: "Not Processed",
  products: [
    {
      _id: "61be6d5e58012c077af1c676",
      product:     {
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
      },
      count: 1,
      selectedColor: "Gray"
    }
  ],
  paymentIntent: {
    id: "pi_3K8CFdL1YUgKoCXC1FiV8cHG"
  },
  orderedBy: { _id : "618ad88d533e172c02a67d63" }
}]

const orderWithNoProduct = [{
  _id: "61be6d8858612c077af1c68f",
  orderStatus: "Not Processed",
  products: [{
    _id: "61be6d5e58012c077af1c676",
    product: null,
    count: 1,
    selectedColor: "Gray"    
  }],
  paymentIntent: {
    id: "pi_3K8CFdL1YUgKoCXC1FiV8cHG"
  },
  orderedBy: { _id : "618ad88d533e172c02a67d63" }
}]

const wrapper = shallow(
  <Orders orders={orders} handleStatusChange={handleStatusChange}
/>)

describe("Orders", () => {
  const paymentInfo = wrapper.find(ShowPaymentInfo)
  const productTitle = wrapper.find({title: "product title"})
  const selectInput = wrapper.find('select')

  test("renders", async () => {
    expect(paymentInfo.length).toBe(1)
    expect(productTitle.text()).toBe("Dell Latitude 3000")
    expect(selectInput.length).toBe(1)
  })

  test("onChange", () => {
    selectInput.simulate("change", {target: {value: "Processing" }});
    expect(handleStatusChange).toHaveBeenCalledWith("61be6d8858012c077af1c68f", "Processing");
  })

  test("Output when a product has been deleted", () => {
    const wrapper = shallow(
      <Orders orders={orderWithNoProduct} handleStatusChange={handleStatusChange}
    />)
    const productTitle = wrapper.find({title: "product message"})
    expect(productTitle.text()).toBe("This product has been deleted.")
  })
})