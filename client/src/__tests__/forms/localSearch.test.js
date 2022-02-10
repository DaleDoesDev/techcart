import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import LocalSearch from "../../components/forms/LocalSearch";

let setKeyword = jest.fn();

const wrapper = mount(<LocalSearch keyword='test' setKeyword={setKeyword}/>);

describe("localSearch form", () => {
  const inputBtn = wrapper.find({value: "test"});

  test("Search renders",() => {
    expect(inputBtn.length).toBe(1);
  })

  test("Search renders",() => {
    inputBtn.simulate("change", {value: 'a'})
    expect(setKeyword).toHaveBeenCalledWith('test')
  })
})