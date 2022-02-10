import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../utilities/category";
import { LoadingOutlined } from "@ant-design/icons";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const showCategories = () => {
    return (
      <div className="mx-auto my-0">
        {categories.map((c, i) => {
          return (
            <Link
              to={`/category/${c.slug}`}
              key={i}
              className="col-auto btn btn-raised mx-3 my-2 text-light bg-danger"
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <LoadingOutlined className="h1 mx-auto" />
        ) : categories.length > 0 ? (
          showCategories()
        ) : (
          <p className="font-weight-bold text-danger mx-auto my-0">
            No Product Categories Found
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
