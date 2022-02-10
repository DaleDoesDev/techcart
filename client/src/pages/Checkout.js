import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
} from "../utilities/user";
import { handleError } from "../utilities/handleError";
import AlignTop from "../components/AlignTop";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("123 Example St.");
  const [zip, setZip] = useState(12345);
  const [addressSaved, setAddressSaved] = useState(false);
  const [priceCents, setPriceCents] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [coupon, setCoupon] = useState("");
  const [oldPrice, setOldPrice] = useState(0);

  const dispatch = useDispatch();
  const history = useHistory();

  const { user, cart } = useSelector((state) => {
    return state;
  });
  const couponHasBeenApplied = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token)
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.cartTotal);
        setOldPrice(res.data.cartTotal); //record the pre-coupon total for future reference
      })
      .catch((err) => handleError(err));
  }, [user]);

  const applyDiscountCoupon = useCallback(() => {
    //either use the currently input coupon code or a previously entered one for this cart
    let appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));

    applyCoupon(user.token, appliedCoupon || coupon)
      .then((res) => {
        if (res.data) {
          setTotal(res.data); //update the current total
          if (!appliedCoupon) {
            window.localStorage.setItem(
              "appliedCoupon",
              JSON.stringify(coupon)
            );
            toast.success(`Coupon "${coupon}" applied successfully!`);
          }
          setCoupon(""); //this is the input field
          dispatch({
            type: "COUPON_APPLIED",
            payload: true,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        handleError(err);
      });
  }, [coupon, dispatch, user]);

  useEffect(() => {
    if (total) {
      //format price for display
      let stringTotal = total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      stringTotal = stringTotal.slice(1, stringTotal.length); //drop the $

      setPriceCents(
        stringTotal.slice(stringTotal.indexOf("."), stringTotal.length + 1)
      );
      setPriceDollars(stringTotal.slice(0, stringTotal.indexOf(".")));

      //check for a coupon applied during this user session
      if (window.localStorage.getItem("appliedCoupon")) {
        let applied = JSON.parse(window.localStorage.getItem("appliedCoupon"));
        if (applied && cart) {
          if (cart.length < 1) {
            toast.error(
              "Error: There must be items in the cart in order to apply a discount.",
              { toastId: "noItems" }
            );
            return;
          } else {
            applyDiscountCoupon();
          }
        }
      }
    }
  }, [total, cart, applyDiscountCoupon]);

  const emptyCart = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("appliedCoupon");
    //clear some state:
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    dispatch({
      type: "COUPON_APPLIED",
      payload: false,
    });
    emptyUserCart(user.token)
      .then(() => {
        //reset component state
        setProducts([]);
        setTotal(0);
        setOldPrice(0);
        setPriceCents("");
        setPriceDollars("");
        toast.success("Cart was emptied successfully.", {
          toastId: "emptyId",
        });
      })
      .catch((err) => handleError(err));
  };

  //address is saved as an obj containing address & zip
  const saveAddressToDb = (e) => {
    e.preventDefault();
    saveUserAddress(user.token, { address, zip })
      .then((res) => {
        if (res.data.ok === true) {
          setAddressSaved(true);
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const showAddress = () => {
    return (
      <form onSubmit={saveAddressToDb}>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Address"
            title="Please enter your delivery address"
            maxLength="60"
          />
        </div>
        <div className="form-group">
          <label>Zipcode</label>
          <input
            type="text"
            name="zipcode"
            className="form-control"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
            placeholder="5 digit zipcode"
            title="Please enter your 5 digit zipcode"
            pattern="[0-9]{5}"
            maxLength="5"
          />
        </div>
        <p className={addressSaved ? "text-muted lead my-0" : "d-none"}>
          Address saved!
        </p>
        <button
          className="btn btn-danger btn-raised mt-2"
          disabled={addressSaved}
          title="address save button"
        >
          Save
        </button>
      </form>
    );
  };

  const showProductSummary = () => {
    return products.map((p, i) => {
      return (
        <div key={i}>
          <p>
            {p.product.title} ({p.selectedColor}) x<b>{p.count}</b> ={" "}
            {(p.product.price * p.count).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      );
    });
  };

  const showApplyCoupon = () => {
    return (
      <>
        <input
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          value={coupon}
          type="text"
          title="coupon"
          className="form-control"
          placeholder={
            couponHasBeenApplied
              ? "Coupon has already been applied."
              : "Coupon code"
          }
          disabled={couponHasBeenApplied}
        />

        <button
          disabled={couponHasBeenApplied}
          onClick={applyDiscountCoupon}
          title="apply coupon"
          className="btn btn-danger btn-raised mt-2 mb-5"
        >
          Apply
        </button>
      </>
    );
  };

  return (
    <div className="row mx-5">
      <div className="col-md-6">
        <h4 className="mt-3 mb-0">Delivery address</h4>
        <p className="text-muted mt-0 mb-2">
          (Pre-populated for testing purposes.)
        </p>

        {showAddress()}

        <h5>Have a Coupon?</h5>
        {showApplyCoupon()}
      </div>
      <div className="col-md-6">
        <h4 className="mt-3">Order Summary:</h4>
        <hr />
        {showProductSummary()}
        <hr />
        Cart Total:
        {!couponHasBeenApplied ? (
          <>
            <AlignTop content={" $"} />
            <b className="h4 font-weight-bold">{priceDollars}</b>
            <AlignTop content={priceCents} strikedOut="false" />
          </>
        ) : (
          <>
            <AlignTop className="text-success" content={" $"} />
            <span className="h4 font-weight-bold ">{priceDollars}</span>
            <AlignTop content={priceCents} strikedOut="false" />
            <s className="ml-2 font-weight-bold text-muted">
              {oldPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </s>
            <p className="bg-success w-50 mt-2 p-0 text-center lead">
              Discount applied!
            </p>
          </>
        )}
        {!addressSaved && (
          <p className="text-muted">
            You must save your delivery address to proceed.
          </p>
        )}
        <div className="row mt-3">
          <div className="col-md-6">
            <button
              disabled={addressSaved === false || products.length < 1}
              className="btn btn-danger btn-raised"
              title="order"
              onClick={() => history.push("/payment")}
            >
              Place Order
            </button>
          </div>
          <div className="col-md-6">
            <button
              disabled={products.length < 1}
              onClick={emptyCart}
              title="empty cart"
              className="btn btn-danger btn-raised"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
