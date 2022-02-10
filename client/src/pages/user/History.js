import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getUserOrders } from "../../utilities/user";
import { handleError } from "../../utilities/handleError";
import { useSelector } from "react-redux";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";

const History = () => {
  const [orders, setOrders] = useState([]);

  const { user } = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (user) {
      getUserOrders(user.token)
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => handleError(err));
    }
  }, [user]);

  const showOrderInTable = (order) => {
    return (
      <table className="table table-sm table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
          </tr>
        </thead>

        <tbody>
          {order.products.map((p, i) => {
            if (p.product === null)
              return (
                <b className="text-warning">This product has been deleted.</b>
              );
            return (
              <tr key={i}>
                <td>
                  <b>{p.product.title}</b>
                </td>
                <td>
                  <p title="price">
                    {p.product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      //the amount is stored in the db as cents, for Stripe
                    })}
                  </p>
                </td>
                <td>
                  <p>{p.product.brand.name}</p>
                </td>
                <td>
                  <p>{p.selectedColor}</p>
                </td>
                <td>
                  <p>{p.count}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>

        <div className="col text-center">
          <h4 className="mt-3" title="header">
            {orders && orders.length > 0 ? "Recent Orders" : "No Recent Orders"}
          </h4>

          {orders &&
            orders.length > 0 &&
            orders.map((o, i) => {
              return (
                <div key={i} className="m-5 p-3 card">
                  <ShowPaymentInfo order={o} />
                  {showOrderInTable(o)}
                  <p>Thank you for shopping with us!</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default History;
