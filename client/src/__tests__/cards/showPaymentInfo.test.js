import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
const order = {
  _id: "61be6d8858012c077af1c68f",
  orderStatus: "Not Processed",
  products: [
    {
      _id: "61be6d5e58012c077af1c676",
      product: "61be6cf797a7300771a157eb",
      count: 1,
      selectedColor: "Gray",
    },
  ],
  paymentIntent: {
    amount: 186991, //this is cents
    created: "1639869821",
    id: "pi_3K8CFdL1YUgKoCXC1FiV8cHG",
  },
  orderedBy: {
    name: "test",
    email: "test@gmail.com",
    address: { address: "123 Example st.", zip: 23454 },
  },
};

const wrapper = shallow(<ShowPaymentInfo order={order} />);

describe("ShowPaymentInfo", () => {
  test("ShowPaymentInfo rendered", () => {
    const amt = wrapper.find("[data-type='amount']");
    expect(amt.length).toBe(1);
    expect(amt.text()).toBe("$1,869.91");
  });
});
