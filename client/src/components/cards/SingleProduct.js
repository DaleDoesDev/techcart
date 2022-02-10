import React, { useEffect, useRef } from "react";
import { Card, Tooltip, Collapse } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Laptop from "../../images/laptop.png";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../utilities/rating";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../utilities/user";
import { handleError } from "../../utilities/handleError";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import decodeHtml from "../../utilities/decodeHtml";

const { Panel } = Collapse;

//this is a child component of the Product page
const SingleProduct = ({
  product,
  onStarClick,
  star,
  modalVisible,
  setModalVisible,
}) => {
  const { title, images, description, _id, quantity } = product;
  const [tooltip, setTooltip] = React.useState("Click to Add");

  const dispatch = useDispatch();
  const history = useHistory();
  const inputEl = useRef(null);

  const { user } = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.innerHTML = decodeHtml(description);
    }
  }, [description]);

  const handleAddToCart = () => {
    if (quantity < 1) return;

    let cart = []; //an array of objects that will be stringified
    if (window.localStorage.getItem("cart")) {
      //check for preexisting cart
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    for (let i = 0; i < cart.length; i++) {
      if (product._id === cart[i]._id) {
        setTooltip("This item is already in the cart."); //update tooltip
        return; //cancel adding a duplicate to the cart
      }
    }

    //append count, default color
    cart.push({
      ...product,
      count: 1,
      selectedColor: product.colors[0],
    });

    //save the return of the above lodash method as the value of cart
    window.localStorage.setItem("cart", JSON.stringify(cart));
    setTooltip("Added"); //update tooltip

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
    setTimeout(() => {
      //side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }, 350);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token)
      .then((res) => {
        toast.success("Wishlist updated successfully.", {
          toastId: "wishToast",
        });
        history.push("/user/wishlist");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows infiniteLoop>
            {images &&
              images.map((i) => (
                <img src={i.url} key={i.public_id} alt="product" />
              ))}
          </Carousel>
        ) : (
          //default image
          <Card
            cover={<img className="p-1" src={Laptop} alt="product" />}
          ></Card>
        )}

        <Collapse bordered={false} defaultActiveKey={["1"]}>
          <Panel forceRender header={<b>About this item</b>} key="1">
            <div ref={inputEl}></div>
          </Panel>
        </Collapse>
      </div>

      <div className="col-md-5">
        <h3 className="jumbotron p-3">{title}</h3>

        <Card
          actions={[
            <Tooltip
              title={
                quantity < 1 ? "This item is currently out of stock" : tooltip
              }
            >
              <div onClick={handleAddToCart} data-type="test">
                <ShoppingCartOutlined className="text-success" /> <br />{" "}
                {quantity < 1 ? (
                  <span className="text-danger">Out of Stock</span>
                ) : (
                  "Add to Cart"
                )}
              </div>
            </Tooltip>,
            <div onClick={handleAddToWishlist} title="wishlist">
              <HeartOutlined className="text-danger" />
              <br />
              Add to Wishlist
            </div>,
            <RatingModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            >
              <StarRating
                name={_id} //this product's _id
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick} //this passes in arguments of newRating, name
                isSelectable={true}
                starRatedColor="#f44336"
                starHoverColor="#f44336"
                starDimension="30px" //they're bigger here when displayed in a modal
                starSpacing="1px"
              />
            </RatingModal>,
          ]}
        >
          {product && product.ratings && product.ratings.length > 0 ? (
            showAverage(product)
          ) : (
            <div className="text-center pt-1 pb-3">No ratings yet</div>
          )}
          {quantity < 1 && (
            <p className="text-center font-weight-bold text-danger">
              Out of Stock
            </p>
          )}
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
