import React from "react";
import { Select } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import decodeHtml from "../../utilities/decodeHtml";

const { Option } = Select;

const ProductUpdateForm = ({
  handleSubmit,
  handleChange,
  handleCategoryChange,
  handleDescriptionChange,
  arrOfSubIds,
  setArrOfSubIds,
  colors,
  setSelectedColors,
  selectedColors,
  values,
  subOptions,
  categories,
  brands,
}) => {
  let { title, description, price, category, quantity, brand } = values;

  //format data for display
  description = decodeHtml(description);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={title}
          onChange={handleChange}
          required
          placeholder="Title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <ReactQuill
          defaultValue={description}
          onChange={handleDescriptionChange}
          theme="snow"
          name="description"
          placeholder={"Please enter the product's description"}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          name="price"
          className="form-control"
          value={price}
          onChange={handleChange}
          required
          placeholder="Price (2 decimal places, excluding $)"
          pattern="^[0-9]*\.[0-9][0-9]"
          title="Please enter a price in the format: xx.xx"
        />
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          name="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
          required
          pattern="^[1-9]\d*$"
          title="Please enter the quantity as a positive whole number"
          placeholder="Quantity (positive whole number)"
        />
      </div>

      <div className="form-group">
        <label>Brand</label>
        <select
          name="brand"
          className="form-control"
          onChange={handleChange}
          required
          value={brand ? brand._id : ""}
        >
          {brands.length > 0 &&
            brands.map((brand) => {
              return (
                <option
                  key={brand._id}
                  value={brand._id /*used to identify current selection*/}
                >
                  {brand.name}
                </option>
              );
            })}
        </select>
      </div>

      {colors && colors.length > 0 && (
        <div className="form-group">
          <label>Colors</label>
          {/*ant design component*/}
          {/* "value" in the onChange below is provided by the ant design component */}
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Please select all available colors for this product"
            value={selectedColors}
            onChange={(value) => {
              setSelectedColors(value);
            }}
            required
          >
            {colors.map((c) => {
              return (
                <Option key={c} value={c}>
                  {c}
                </Option>
              );
            })}
          </Select>
        </div>
      )}

      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          onChange={handleCategoryChange}
          required
          value={category._id}
        >
          {categories.length > 0 &&
            categories.map((category) => {
              return (
                <option
                  key={category._id}
                  value={category._id /*used to identify current selection*/}
                >
                  {category.name}
                </option>
              );
            })}
        </select>
      </div>

      {subOptions && subOptions.length > 0 && (
        <div>
          <label>Sub Categories</label>
          {/*ant design component*/}
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Please Select"
            value={arrOfSubIds} //default value: The ids of subcategories for this product
            // "value" in the onChange fn below is provided by the ant design component
            onChange={(value) => setArrOfSubIds(value)}
            required
          >
            {subOptions.map((s) => {
              return (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              );
            })}
          </Select>
        </div>
      )}

      <br />
      <button className="btn btn-danger btn-raised mb-5">Save</button>
    </form>
  );
};

export default ProductUpdateForm;
