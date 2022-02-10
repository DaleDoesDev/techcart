import React, { useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../utilities/stripe";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { handleError } from "../utilities/handleError";
import { createOrder, emptyUserCart } from "../utilities/user";
import stripeImg from "../images/stripe.png";

const StripeCheckout = () => {
  const dispatch = useDispatch();
  const { user, coupon, cart } = useSelector((state) => {
    return state;
  });

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [processing, setProcessing] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [clientSecret, setClientSecret] = React.useState("");

  const stripe = useStripe();

  const elements = useElements();

  useEffect(() => {
    //send coupon for backend transaction calclation
    if (cart.length < 1) {
      return;
    }
    createPaymentIntent(user.token, coupon)
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => handleError(err));
  }, [user.token, coupon, cart.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement), //stripe component
        billing_details: {
          name: e.target.name.value,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      setSuccess(false);
    } else {
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          localStorage.removeItem("cart");
          localStorage.removeItem("appliedCoupon");
          //clear redux cart:
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          //empty the cart from the db
          emptyUserCart(user.token);
        }
      });
      setError(null);
      setProcessing(false);
      setSuccess(true);
      toast.success("Payment completed successfully!");
    }
  };

  const handleChange = async (e) => {
    setDisabled(e.empty); //disable pay btn if any errors
    setError(e.error ? e.error.message : "");
  };

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!success && cart.length > 0 ? (
        <>
          <h4>Complete Your Purchase</h4>
          <p className="text-muted">For testing: Use 4242 4242 4242 4242</p>
        </>
      ) : (
        <h4>Purchase Complete</h4>
      )}

      <div
        className={
          success || cart.length < 1
            ? "result-message mb-3 mt-0"
            : "result-message hidden"
        }
      >
        <Link to="/user/history" className="text-danger">
          See your purchase history
        </Link>
      </div>
      {cart.length > 0 && (
        <>
          <form
            id="payment-form"
            className="stripe-form"
            onSubmit={handleSubmit}
            action=""
          >
            <CardElement
              id="card-element"
              options={cartStyle}
              onChange={handleChange}
            />
            <button
              className="stripe-button"
              disabled={processing || disabled || success}
            >
              <span id="button-text">
                {processing ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  "Pay"
                )}
              </span>
            </button>
            <br />
            {error && (
              <div className="card-error" role="alert">
                {error}
              </div>
            )}
          </form>
          <img
            style={{ maxWidth: "125px" }}
            src={stripeImg}
            alt="stripe logo"
          />
        </>
      )}
    </>
  );
};

export default StripeCheckout;
