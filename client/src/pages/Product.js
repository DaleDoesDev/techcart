import React, { useEffect, useState } from "react";
import { getProduct, productStar, getRelated } from "../utilities/product";
import SingleProduct from "../components/cards/SingleProduct";
import ProductCard from "../components/cards/ProductCard";
import { useSelector } from "react-redux";
import { handleError } from "../utilities/handleError";
import { toast } from "react-toastify";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState({});
  const [star, setStar] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useSelector((state) => {
    return state;
  });

  //get the product and related products
  useEffect(() => {
    getProduct(match.params.slug).then((res) => {
      setProduct(res.data);
      getRelated(res.data._id).then((resTwo) => {
        setRelated(resTwo.data);
      });
    });
  }, [match.params.slug]);

  //current user's star rating for this product, if previously rated
  useEffect(() => {
    if (product.ratings && user) {
      //array method find() is used below on the ratings array of objects
      //check if the user has left a rating before for this product:
      let existingRatingObject = product.ratings.find(
        (el) => el.postedBy.toString() === user._id.toString() //return a match, if any
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  }, [product.ratings, user]);

  //"name" is product._id passed from the <StarRating /> on SingleProduct
  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token)
      .then(() => {
        setModalVisible(false);
        toast.success(
          "Thank you for your product review! It will appear shortly."
        );
      })
      .catch((err) => {
        handleError(err);
      });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row pt-4">
          <SingleProduct
            product={product}
            onStarClick={onStarClick}
            star={star}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col text-center py-5 px-0">
            <h4 className="text-center p-2 mt-5 mb-3 h2 font-weight-light jumbotron">
              Related Products
            </h4>
          </div>
        </div>
        <div className="row pb-5">
          {related.length ? (
            related.map((p) => {
              return (
                <div key={p._id} className="col-md-4">
                  <ProductCard product={p} />
                </div>
              );
            })
          ) : (
            <div className="text-center col">No related products found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
