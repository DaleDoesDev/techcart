import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeFromWishlist } from "../../utilities/user";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleError } from "../../utilities/handleError";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => {
    return state;
  });

  const loadWishlist = (token) => {
    getWishlist(token)
      .then((res) => {
        setWishlist(res.data.wishlist);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  useEffect(() => {
    loadWishlist(user.token);
  }, [user.token]);

  const handleRemove = (productId) => {
    removeFromWishlist(productId, user.token)
      .then((res) => {
        loadWishlist(user.token);
        toast.success("Product removed successfully.", {
          toastId: "removeWishlist",
        });
      })
      .catch((err) => handleError(err));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4 className="mt-3" title="header">
            Wishlist
          </h4>

          {wishlist.map((p) => {
            return (
              <div key={p._id} className="alert alert-secondary p-3">
                <Link
                  className="font-weight-bold"
                  title="product link"
                  to={`/product/${p.slug}`}
                >
                  {p.title}
                </Link>
                <span
                  onClick={() => handleRemove(p._id)}
                  title="remove"
                  className="btn btn-small float-right m-0 py-0"
                >
                  <CloseOutlined className="text-danger" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
