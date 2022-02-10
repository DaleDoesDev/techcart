import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop.png";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => {
    return state;
  });

  const imageStyle = {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart (${cart.length})`}
      onClose={() =>
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        })
      }
      visible={drawer}
    >
      {cart.map((p) => {
        return (
          <div key={p._id} className="row mb-3">
            <div className="col-8 mx-auto">
              {p.images[0] ? (
                <img
                  style={imageStyle}
                  alt="product in cart"
                  src={p.images[0].url}
                />
              ) : (
                <img style={imageStyle} alt="default product" src={laptop} />
              )}
              <p className="text-center bg-secondary text-light mt-1">{`${p.title} x${p.count}`}</p>
            </div>
          </div>
        );
      })}
      <Link to="/cart">
        <Button
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="text-center btn btn-danger btn-raised btn-block w-50"
        >
          Go to Cart
        </Button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
