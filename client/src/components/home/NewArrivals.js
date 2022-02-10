import React, { useState, useEffect } from "react";
import { getProducts, getProductsCount } from "../../utilities/product";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { Pagination } from "antd";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0); //used for pagination
  const [page, setPage] = useState(1);
  const [paginationUsed, setPaginationUsed] = useState(false);

  useEffect(() => {
    setLoading(true);
    //sort, order, limit
    getProducts("createdAt", "desc", page)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
        if (paginationUsed === true) {
          let el = document.querySelector("#newArrivals");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [page, paginationUsed]); //track pagination

  useEffect(() => {
    getProductsCount()
      .then((res) => {
        //only show 6 products max
        if (res.data > 6) setProductsCount(6);
        else setProductsCount(res.data);
      })
      .catch(() => setProductsCount(0));
  }, []);

  const handleChange = (value) => {
    setPage(value);
    setPaginationUsed(true);
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : products.length > 0 ? (
          <div className="row">
            {products.map((product) => {
              return (
                <div className="col-md-4 pb-3" key={product._id}>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-weight-bold text-center text-danger m-0">
            No Products Found
          </p>
        )}

        {productsCount > 0 && (
          <div className="row">
            <nav className="col-md-4 offset-md-4 text-center pt-2 p-3">
              <Pagination //"value", below in the onChange, is coming from this antd component
                current={page}
                //3 products per page
                total={(productsCount / 3) * 10} //a max of 10 pagination links ever
                onChange={(value) => handleChange(value)}
              />
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default NewArrivals;
