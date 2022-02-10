import React from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { Link } from "react-router-dom";
import { showAverage } from "../../utilities/rating";
import { useDispatch } from "react-redux";

const { Meta } = Card;

//child of Product page
const ProductCard = ({ product }) => {
  let { images, title, slug, price, quantity } = product;
  const [tooltip, setTooltip] = React.useState("Click to Add");

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (quantity < 1) {
      return;
    }

    let cart = []; //an array of objects that will be stringified
    if (window.localStorage.getItem("cart")) {
      //check for preexisting cart
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    for (let i = 0; i < cart.length; i++) {
      if (product._id === cart[i]._id) {
        setTooltip("This item is already in the cart"); //update tooltip
        return; //cancel adding a duplicate to the cart
      }
    }

    //append count, default color
    cart.push({
      ...product,
      count: 1,
      selectedColor: product.colors[0],
    });

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

  return (
    <>
      <Card
        className="text-center mb-3"
        bordered={false}
        cover={
          <img
            className="p-1"
            style={{
              height: "150px",
              objectFit: "contain",
            }}
            src={images && images.length ? images[0].url : laptop}
            alt="product"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-info" /> <br /> View Product
          </Link>,
          <Tooltip
            title={
              quantity < 1 ? "This item is currently out of stock" : tooltip
            }
          >
            <div data-type="test" onClick={handleAddToCart}>
              <ShoppingCartOutlined className="text-success" /> <br />{" "}
              {quantity < 1 ? (
                <span className="text-danger">Out of Stock</span>
              ) : (
                "Add to Cart"
              )}
            </div>
          </Tooltip>,
        ]}
      >
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3 text-muted">No ratings yet</div>
        )}
        <Meta
          title={title}
          description={price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        />
      </Card>
    </>
  );
};

export default ProductCard;
