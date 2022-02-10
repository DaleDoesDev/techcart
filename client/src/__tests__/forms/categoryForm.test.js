import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import CategoryForm from "../../components/forms/CategoryForm";

const handleSubmit = jest.fn();
const setName = jest.fn();

const wrapper = shallow(
  <CategoryForm setName={setName} name="test-category" handleSubmit={handleSubmit}/>
)

describe("CategoryForm", () => {
  const nameInput = wrapper.find({value: "test-category"})
  const submitBtn = wrapper.find("button")
  const form = wrapper.find("form")

  test("CategoryForm renders",() => {
    expect(nameInput.length).toBe(1);
    expect(submitBtn.length).toBe(1)
    expect(form.length).toBe(1)
  })

  test("CategoryForm onChange and submit",() => {
   nameInput.simulate("change", { target: { value: 'a' } })
   expect(setName).toHaveBeenCalledWith('a')
   form.simulate("submit");
   expect(handleSubmit).toHaveBeenCalled();
  })
})