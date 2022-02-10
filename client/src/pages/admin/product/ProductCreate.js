import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../utilities/product";
import { handleError } from "../../../utilities/handleError";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import FileUpload from "../../../components/forms/FileUpload";
import { getCategories, getCategorySubs } from "../../../utilities/category";
import { getBrands } from "../../../utilities/brand";

const initialState = {
  title: "",
  description: "",
  price: 0.0,
  category: "",
  subs: [],
  quantity: 0,
  images: [],
  brand: "",
};

const ProductCreate = ({ history }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  //a selection of colors the admin may label the product as available in
  const colors = [
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
    "Red",
    "Gold",
    "Gray",
    "Green",
    "Orange",
    "Pink",
    "Purple",
  ];

  useEffect(() => {
    const loadCategories = () => {
      getCategories().then((res) => {
        setCategories(res.data);
      });
    };

    const loadBrands = () => {
      getBrands().then((res) => {
        setBrands(res.data);
      });
    };

    loadCategories();
    loadBrands();
  }, []);

  const { user } = useSelector((state) => {
    return state;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    values.colors = selectedColors;
    setLoading(true);
    createProduct(values, user.token)
      .then((res) => {
        toast.success(`Product "${res.data.title}" was created successfully.`);
        setLoading(false);
        history.push("/admin/products");
      })
      .catch((err) => {
        handleError(err);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    /*
      Spread the current state object, updating any given key with its input value.
      Bracket notation is used for the object key to avoid a syntax error w. any key name.
    */
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setValues({ ...values, description: value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value }); //reset the subcategories, too
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
      setShowSub(true);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10 mt-3">
          {loading ? <h4>Loading...</h4> : <h4>Create Product</h4>}
          <hr />
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductCreateForm
            categories={categories}
            brands={brands}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            handleDescriptionChange={handleDescriptionChange}
            setSelectedColors={setSelectedColors}
            selectedColors={selectedColors}
            colors={colors}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};
export default ProductCreate;
