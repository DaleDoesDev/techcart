import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createBrand,
  getBrands,
  getBrand,
  removeBrand,
} from "../../../utilities/brand";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { handleError } from "../../../utilities/handleError";

const BrandCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");

  const { user } = useSelector((state) => state);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = () => {
    getBrands().then((res) => setBrands(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createBrand(name, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        loadBrands();
        toast.success(`Brand "${res.data.name}" was created successfully.`);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  const handleRemove = async (slug) => {
    //brand cannot be deleted if there are associated products
    getBrand(slug)
      .then((res) => {
        if (res.data.products.length > 0) {
          let msg =
            res.data.products.length > 1
              ? `Error: There are ${res.data.products.length} products associated with this brand.`
              : `Error: There is 1 product associated with this brand.`;
          toast.error(msg, { toastId: "deleteErrToast" });
          return;
        }
        if (window.confirm("Are you sure you want to delete this brand?")) {
          setLoading(true);
          removeBrand(slug, user.token)
            .then((res) => {
              setLoading(false);
              loadBrands();
              toast.success(`${res.data.name} was deleted successfully.`);
            })
            .catch((err) => {
              setLoading(false);
              handleError(err);
            });
        }
      })
      .catch((err) => handleError(err));
  };

  //higher order function
  const searched = (keyword) => {
    return (brand) => {
      //this nested fn is used with .filter()
      return brand.name.toLowerCase().includes(keyword);
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
              <h4 className="mt-3">Create Brand</h4>
            )}
            <CategoryForm //reusing component
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />

            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {brands.filter(searched(keyword)).map((brand) => {
              return (
                <div key={brand._id} className="alert alert-secondary">
                  {brand.name}
                  <span
                    title="remove brand"
                    onClick={() => handleRemove(brand.slug)}
                    className="btn btn-small float-right text-danger"
                  >
                    <DeleteOutlined />
                  </span>
                  <Link to={`/admin/brand/${brand.slug}`} title="brand link">
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

export default BrandCreate;
