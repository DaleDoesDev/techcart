import React, {useEffect } from "react";
import { getCoupons } from "../../utilities/coupon";

const CouponBanner = () => {
  const [coupons, setCoupons] = React.useState([]);

  useEffect(() => {
    getCoupons().then((res) => setCoupons(res.data));
  }, []);

  return (
    <div className={coupons.length > 0 ? "bg-dark m-0 " : "d-hidden"}>
      {coupons.length > 0 && (
        <h4 className="lead text-white font-weight-bold text-center m-0 py-2">
          Use coupon code <span className="text-danger">{coupons[0].name}</span>{" "}
          at checkout for{" "}
          <span className="text-info" title="discount">{coupons[0].discount}%</span> off.
          Expires:{" "}
          <span className="text-danger">
            {new Date(coupons[0].expire).toLocaleDateString()}
          </span>
        </h4>
      )}
    </div>
  );
};

export default CouponBanner;
