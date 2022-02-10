import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import AdminNav from "../../../components/nav/AdminNav";
import FileUpload from "../../../components/forms/FileUpload";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

import { toast } from "react-toastify";

import { getProduct, updateProduct } from "../../../utilities/product";
import { getBrands } from "../../../utilities/brand";
import { handleError } from "../../../utilities/handleError";
import { getCategories, getCategorySubs } from "../../../utilities/category";

const initialState = {
  title: "",
  description: "",
  price: 0.0,
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  brand: "",
};

//match & history are from react-router-dom's BrowserRouter
const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]); //displays the subcategories in a dropdown
  const [selectedColors, setSelectedColors] = useState([]);
  const [arrOfSubIds, setArrOfSubIds] = useState([]); //just the ids: used to pre-populate data
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

  const { user } = useSelector((state) => {
    return state;
  });

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

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value }); //reset the subcategories too
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
    });
    setArrOfSubIds([]); //reset the subcategory ids for the <Select /> component
  };

  const handleDescriptionChange = (value) => {
    setValues({ ...values, description: value });
  };

  const handleChange = (e) => {
    /*
      Spread the current state object, updating any given key with its input value.
      Bracket notation is used for the object key to avoid a syntax error w. any key name.
    */
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    //product search & get subcategories
    getProduct(match.params.slug)
      .then((res) => {
        setValues((values) => {
          //object key:value merge, price.toFixed() to add .00 cents to whole dollar prices
          return { ...values, ...res.data, price: res.data.price.toFixed(2) };
        });

        getCategorySubs(res.data.category._id).then((nestedRes) => {
          setSubOptions(nestedRes.data);
        });

        /*
          the antd <Select/> component on ProductUpdateForm requires just the _id of all the subcategories as an array to pre-populate the selected Product subcategories.
        */
        let arr = [];
        res.data.subs.map((s) => {
          return arr.push(s._id);
        });
        setArrOfSubIds(arr);
        setSelectedColors(res.data.colors);
      })
      .catch((err) => {
        handleError(err);
      });

    loadCategories();
    loadBrands();
  }, [match.params.slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    //subcategory ids are stored as seperate state on this update screen.
    //they're reattached here to the product for an update.
    values.subs = arrOfSubIds;
    values.colors = selectedColors;
    updateProduct(values, match.params.slug, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`Product "${res.data.title}" was updated successfully.`);
        history.push("/admin/products");
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="mt-3">Loading...</h4>
          ) : (
            <>
              <h4 className="mt-3">Update Product</h4>
              <hr />
              <div className="p-3">
                <FileUpload
                  values={values}
                  setValues={setValues}
                  setLoading={setLoading}
                />
              </div>

              {values && values.description && (
                <ProductUpdateForm
                  categories={categories}
                  brands={brands}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  handleCategoryChange={handleCategoryChange}
                  values={values}
                  setValues={setValues}
                  subOptions={subOptions}
                  arrOfSubIds={arrOfSubIds}
                  handleDescriptionChange={handleDescriptionChange}
                  setSelectedColors={setSelectedColors}
                  selectedColors={selectedColors}
                  colors={colors}
                  setArrOfSubIds={setArrOfSubIds}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
