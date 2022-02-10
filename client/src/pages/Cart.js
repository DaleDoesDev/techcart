import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProductCardCheckout from "../components/cards/ProductCardCheckout";
import AlignTop from "../components/AlignTop";
import { userCart } from "../utilities/user";
import { handleError } from "../utilities/handleError";

const Cart = () => {
  const [priceCents, setPriceCents] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const { user, cart } = useSelector((state) => {
    return state;
  });

  const history = useHistory();

  //get cart total
  useEffect(() => {
    let total = cart
      .reduce(
        (accumulator, nxtValue) => {
          return (accumulator += nxtValue.count * nxtValue.price);
        },
        0 //starting value for .reduce
      )
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

    total = total.slice(1, total.length); //drop the $

    setPriceCents(total.slice(total.indexOf("."), total.length + 1));
    setPriceDollars(total.slice(0, total.indexOf(".")));
  }, [cart]);

  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok === true) history.push("/checkout");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const showCartItems = () => {
    return (
      <table className="table-sm table-bordered ">
        <thead className="thead-light">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>

        {cart.map((p) => {
          return <ProductCardCheckout key={p._id} p={p} />;
        })}
      </table>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <h3 className="mt-3">
            Cart (<span className="text-danger">{cart.length}</span>)
          </h3>
          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop">Continue Shopping.</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4 className="mt-3">Order Summary</h4>
          <hr />
          {cart.map((c, i) => {
            return (
              <div key={i}>
                <p title="price calculation">
                  {c.title} x<b>{c.count}</b> ={" "}
                  {(c.price * c.count).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
            );
          })}
          <hr />
          Subtotal:
          <AlignTop content={" $"} />
          <b className="h4 font-weight-bold">{priceDollars}</b>
          <AlignTop content={priceCents} />
          <p className="text-muted mb-0 mt-2">
            Note: Discount coupons may be applied at checkout.
          </p>
          <hr />
          {user ? (
            <button
              onClick={saveOrderToDb}
              title="checkout"
              className="btn btn-danger btn-raised mt-1 mb-4"
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          ) : (
            <button className="btn btn-danger btn-raised mt-1 mb-4 ">
              <Link
                className="text-light"
                //the below is handled on pages/login
                to={{
                  pathname: "/login", //send to login page
                  state: {
                    //...this saves the desired page to redirect back to
                    from: "cart",
                  },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
