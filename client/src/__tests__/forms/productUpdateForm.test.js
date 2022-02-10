import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import { Select } from "antd";
import ReactQuill from "react-quill";

import ProductUpdateForm from "../../components/forms/ProductUpdateForm";

const handleSubmit = jest.fn();
const handleChange = jest.fn();
const setArrOfSubIds = jest.fn();
const handleCategoryChange = jest.fn();
const handleDescriptionChange = jest.fn();
const setSelectedColors = jest.fn();
const setValues = jest.fn();
const colors = ["green", "blue"]
const brands = [
  {name: "apple", _id: 7876}, 
  {name: "dell", _id: 7034}
]
const categories = [
  {name: "gaming laptops", _id: 6354}, 
  {name: "business laptops", _id: 5464}
]
let subOptions = [{name: "macbook air", _id: 4352}]
let selectedColors = ["white"];
const arrOfSubIds = [4352]
let values = {
  title: "Test Product",
  description: "An example",
  price: 999.99,
  category: {name: "gaming laptops", _id: 6354},
  quanity: 2,
  brand: {name: "apple", _id: 7876}
};

const wrapper = shallow(
  <ProductUpdateForm 
    handleSubmit={handleSubmit}
    handleChange={handleChange}
    handleCategoryChange={handleCategoryChange}
    handleDescriptionChange={handleDescriptionChange}
    setValues={setValues}
    setSelectedColors={setSelectedColors}
    setArrOfSubIds={setArrOfSubIds}
    colors={colors}
    brands={brands}
    arrOfSubIds={arrOfSubIds}
    categories={categories}
    selectedColors={selectedColors}
    subOptions={subOptions}
    values={values}
  />
)

describe("ProductCreateForm", () => {
   const selectColorsInput = wrapper.find(Select).at(0);
   const selectSubsInput = wrapper.find(Select).at(1);
   const titleInput = wrapper.find({name: "title"});
   const descriptionInput = wrapper.find(ReactQuill);
   const priceInput = wrapper.find({name: "price"});
   const quantityInput = wrapper.find({name: "quantity"});
   const brandInput = wrapper.find({name: "brand"});
   const categoryInput = wrapper.find({name: "category"});
   const form = wrapper.find('form');

  test("ProductCreateForm renders", () => {
    expect(selectColorsInput.length).toBe(1);
    expect(selectSubsInput.length).toBe(1);
    expect(titleInput.length).toBe(1);
    expect(descriptionInput.length).toBe(1);
    expect(priceInput.length).toBe(1);
    expect(quantityInput.length).toBe(1);
    expect(brandInput.length).toBe(1);
    expect(categoryInput.length).toBe(1);
    expect(form.length).toBe(1);
  })

  test("ProductCreateForm color onChange", () => {
    selectColorsInput.simulate("change", { target: { value: 'green' } })
    expect(setSelectedColors).toHaveBeenCalled();
  })

  test("ProductCreateForm sub onChange", () => {
    selectSubsInput.simulate("change", {value: 4352})
    expect(setArrOfSubIds).toHaveBeenCalled();
  })

  test("ProductCreateForm handleDescriptionChange", () => {
    descriptionInput.simulate("change", {value: "a"});
    expect(handleDescriptionChange).toHaveBeenCalled();
  })

  test("ProductCreateForm handleCategoryChange", () => {
    categoryInput.simulate("change", {value: "gaming laptops"});
    expect(handleCategoryChange).toHaveBeenCalled();
  })

  test("Many of the inputs trigger the handleChange fn", () => {
    titleInput.simulate("change", {value: "a"});
    priceInput.simulate("change", {value: "4.99"});
    brandInput.simulate("change", {value: "b"});
    quantityInput.simulate("change", {value: 1});

    expect(handleChange).toHaveBeenCalledTimes(4);
  });

  test("ProductCreateForm form submit", () => {
    form.simulate("submit");
    expect(handleSubmit).toHaveBeenCalled();
  })

})