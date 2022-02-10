import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  getCategory,
  getCategorySubs,
  removeCategory,
} from "../../../utilities/category";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { handleError } from "../../../utilities/handleError";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const { user } = useSelector((state) => state);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCategory(name, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        loadCategories();
        toast.success(`Category "${res.data.name}" was created successfully.`);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  const handleRemove = async (slug) => {
    //category cannot be deleted if there are associated products
    getCategory(slug)
      .then((res) => {
        if (res.data.products.length > 0) {
          let msg =
            res.data.products.length > 1
              ? `Error: There are ${res.data.products.length} products associated with this category.`
              : `Error: There is 1 product associated with this category.`;
          toast.error(msg, { toastId: "deleteErrToast" });
          return;
        }
        //category cannot be deleted if there are associated subcategories
        getCategorySubs(res.data.category._id).then((res) => {
          if (res.data.length > 0) {
            let msgTwo =
              res.data.length > 1
                ? `Error: There are ${res.data.length} subcategories associated with this category.`
                : `Error: There is 1 subcategory associated with this category.`;
            toast.error(msgTwo, { toastId: "deleteErrToast" });
            return;
          }

          if (
            window.confirm("Are you sure you want to delete this category?")
          ) {
            setLoading(true);
            removeCategory(slug, user.token)
              .then((res) => {
                setLoading(false);
                loadCategories();
                toast.success(`${res.data.name} was deleted successfully.`);
              })
              .catch((err) => {
                setLoading(false);
                handleError(err);
              });
          }
        });
      })
      .catch((err) => handleError(err));
  };

  //higher order function
  const searched = (keyword) => {
    return (category) => {
      //this nested fn is used with .filter()
      return category.name.toLowerCase().includes(keyword);
      //"keyword" is now attached to this nested fn from its parent, searched
    };
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col mb-5">
            {loading ? (
              <LoadingOutlined className="h1" />
            ) : (
              <h4 className="mt-3">Create Category</h4>
            )}
            <CategoryForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />

            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {categories.filter(searched(keyword)).map((category) => {
              return (
                <div key={category._id} className="alert alert-secondary">
                  {category.name}
                  <span
                    title="remove"
                    onClick={() => handleRemove(category.slug)}
                    className="btn btn-small float-right text-danger"
                  >
                    <DeleteOutlined />
                  </span>
                  <Link to={`/admin/category/${category.slug}`}>
                    <span className="btn btn-small float-right text-primary">
                      <EditOutlined />
                    </span>
                  </Link>
                </div>
              );
            })}
            <br />
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryCreate;
