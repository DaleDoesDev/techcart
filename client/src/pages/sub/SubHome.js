import React, { useEffect, useState } from "react";
import { getSub } from "../../utilities/sub";
import { LoadingOutlined } from "@ant-design/icons";
import ProductCard from "../../components/cards/ProductCard";

const SubHome = ({ match }) => {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSub(match.params.slug).then((res) => {
      setSub(res.data.sub);
      setProducts(res.data.products);
      setLoading(false);
    });
  }, [match.params.slug]);

  return (
    <div className="container  mb-5">
      <div className="row">
        <div className="col">
          {loading ? (
            <LoadingOutlined className="text-center p-3 my-5 display-4" />
          ) : (
            <h4
              className="text-center p-2 mt-5 mb-5 h2 font-weight-light jumbotron"
              title="sub header"
            >
              {products.length} products in subcategory "{sub.name}"
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((p) => {
          return (
            <div className="col-md-4" key={p._id}>
              <ProductCard product={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubHome;
