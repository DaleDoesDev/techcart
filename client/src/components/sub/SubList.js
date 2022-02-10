import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../utilities/sub";
import { LoadingOutlined } from "@ant-design/icons";

const SubList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs()
      .then((res) => {
        setSubs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const showSubs = () => {
    return (
      <div className="mx-auto my-0">
        {subs.map((s) => {
          return (
            <Link
              to={`/sub/${s.slug}`}
              key={s._id}
              className="col-auto btn btn-raised mx-3 my-2 text-light bg-danger"
            >
              {s.name}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row mb-5">
        {loading ? (
          <LoadingOutlined className="h1 mx-auto" />
        ) : subs.length > 0 ? (
          showSubs()
        ) : (
          <p className="font-weight-bold text-danger mx-auto">
            No Product Subcategories Found
          </p>
        )}
      </div>
    </div>
  );
};

export default SubList;
