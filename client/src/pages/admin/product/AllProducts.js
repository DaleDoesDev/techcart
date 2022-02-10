import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import AdminNav from "../../../components/nav/AdminNav";
import {
  getProducts,
  getProductsCount, //returns the total number of all products in the db
  removeProduct,
} from "../../../utilities/product";
import { handleError } from "../../../utilities/handleError";
import { Pagination } from "antd";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  //the 3 below are for pagination
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [paginationUsed, setPaginationUsed] = useState(false);

  const { user } = useSelector((state) => {
    return state;
  });

  //for pagination interaction
  const handleChange = (value) => {
    setPage(value);
    setPaginationUsed(true);
  };

  const loadAllProducts = useCallback(() => {
    setLoading(true);
    getProductsCount()
      .then((res) => setProductsCount(res.data))
      .catch(() => setProductsCount(0));

    //show 6 default products
    getProducts("sold", "desc", page, 6)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
        if (paginationUsed === true) {
          let el = document.querySelector("#allProductsHeader");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  }, [page, paginationUsed]);

  const handleRemove = (slug) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      removeProduct(slug, user.token)
        .then((res) => {
          //reload products post-delete
          loadAllProducts();
          toast.success(
            `Product "${res.data.title}" was removed successfully.`
          );
        })
        .catch((err) => {
          handleError(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>

          <div className="col">
            {loading ? (
              <h4 className="mt-3" id="allProductsHeader">
                Loading...
              </h4>
            ) : (
              <h4 className="mt-3" id="allProductsHeader">
                All Products
              </h4>
            )}

            <div className="row">
              {products.map((p) => {
                return (
                  <div key={p._id} className="col-md-4 pb-3">
                    <AdminProductCard product={p} handleRemove={handleRemove} />
                  </div>
                );
              })}
            </div>
            {productsCount > 0 && (
              <div className="row ">
                <nav className="col-md-4 offset-md-4 text-center pt-2 p-3">
                  <Pagination //"value", below in the onChange, is coming from this antd component
                    current={page}
                    className="mb-5"
                    total={(productsCount / 6) * 10} //a max of 10 pagination links ever
                    onChange={(value) => handleChange(value)}
                  />
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
