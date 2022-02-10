import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../utilities/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";
import { handleError } from "../../../utilities/handleError";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expire, setExpire] = useState(new Date());
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState("");
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => {
    return state;
  });

  const getAllCoupons = () => {
    setLoading(true);
    getCoupons().then((res) => {
      setCoupons(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expire, discount }, user.token)
      .then((res) => {
        setLoading(false);
        getAllCoupons();
        toast.success(`Coupon "${name}" was created successfully.`);
        setName("");
        setDiscount("");
        setExpire(new Date());
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  const handleRemove = (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      removeCoupon(couponId, user.token)
        .then((res) => {
          getAllCoupons();
          toast.success(`Coupon "${res.data.name}" was deleted successfully.`);
        })
        .catch((err) => {
          setLoading(false);
          handleError(err);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="mt-3">Loading...</h4>
          ) : (
            <h4 className="mt-3">Coupon</h4>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Coupon name"
                autoFocus
                required
                title="Please enter the coupon's name."
              />
            </div>

            <div className="form-group">
              <label htmlFor="Discount">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                name="Discount"
                required
                pattern="^[1-9]\d*$"
                title="Please enter the coupon's discount as a positive whole number."
                placeholder={`Discount percent (example: 50)`}
              />
            </div>

            <div className="form-group">
              <label htmlFor="Expire">Expiration</label>
              <DatePicker
                className="form-control"
                selected={expire}
                value={expire}
                required
                onChange={(date) => setExpire(date)}
                name="Expire"
              />
            </div>
            <button className="btn btn-danger btn-raised">Save</button>
          </form>

          <br />

          <table className="table table-sm table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Discount</th>
                <th scope="col">Expiration</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                return (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.discount}%</td>
                    <td>{new Date(c.expire).toLocaleDateString()}</td>
                    <td>
                      <DeleteOutlined
                        onClick={() => handleRemove(c._id)}
                        className="text-danger pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
