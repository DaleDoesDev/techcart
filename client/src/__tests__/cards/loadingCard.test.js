import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import LoadingCard from "../../components/cards/LoadingCard";
const wrapper = shallow(<LoadingCard count={3} />);

describe("LoadingCard", () => {
  test("LoadingCard renders 3 skeletons", () => {
    const skeletons = wrapper.find("Skeleton");
    expect(skeletons.length).toBe(3);
  });
});
