import axios from "axios";

export const createPaymentIntent = (authtoken, coupon) => {
  return axios.post(
    `${process.env.REACT_APP_API}/create-payment-intent`,
    { appliedCoupon: coupon }, //boolean value
    {
      headers: {
        authtoken,
      },
    }
  );
};
