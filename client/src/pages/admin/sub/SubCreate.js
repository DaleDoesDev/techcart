import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createSub, getSubs, getSub, removeSub } from "../../../utilities/sub";
import { getCategories } from "../../../utilities/category";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { handleError } from "../../../utilities/handleError";

const SubCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);
  const [keyword, setKeyword] = useState("");

  const { user } = useSelector((state) => state);

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  const loadSubs = () => {
    getSubs().then((res) => setSubs(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (category) {
      createSub({ name, parent: category }, user.token)
        .then((res) => {
          setLoading(false);
          setName("");
          toast.success(
            `Subcategory "${res.data.name}" was created successfully.`
          );
          loadSubs();
        })
        .catch((err) => {
          setLoading(false);
          handleError(err);
        });
    } else {
      setLoading(false);
      toast.error("You must select a category first.");
    }
  };

  const handleRemove = async (slug) => {
    //subcategory cannot be deleted if there are associated products
    getSub(slug)
      .then((res) => {
        if (res.data.products.length > 0) {
          let msg =
            res.data.products.length > 1
              ? `Error: There are ${res.data.products.length} products associated with this subcategory.`
              : `Error: There is 1 product associated with this subcategory.`;
          toast.error(msg, { toastId: "deleteErrToast" });
        } else {
          if (
            window.confirm("Are you sure you want to delete this subcategory?")
          ) {
            setLoading(true);
            removeSub(slug, user.token)
              .then((res) => {
                setLoading(false);
                toast.success(`"${res.data.name}" was deleted successfully.`);
                loadSubs();
              })
              .catch((err) => {
                setLoading(false);
                handleError(err);
              });
          }} })
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
              <h4 className="mt-3">Create Subcategory</h4>
            )}

            <CategoryForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />

            <div className="form-group">
              <label>Parent Category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="">Please select.</option>
                {categories.length > 0 &&
                  categories.map((category) => {
                    return (
                      <option
                        key={category._id}
                        value={
                          category._id /*used to identify current selection*/
                        }
                        title="category option"
                      >
                        {category.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <LocalSearch keyword={keyword} setKeyword={setKeyword} />
            {subs.filter(searched(keyword)).map((sub) => {
              return (
                <div key={sub._id} className="alert alert-secondary">
                  {sub.name}
                  <span
                    title="remove subcategory"
                    onClick={() => handleRemove(sub.slug)}
                    className="btn btn-small float-right text-danger"
                  >
                    <DeleteOutlined />
                  </span>
                  <Link
                    title="link to subcategory"
                    to={`/admin/sub/${sub.slug}`}
                  >
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

export default SubCreate;
