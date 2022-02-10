import React from "react";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";

const Orders = ({ orders, handleStatusChange }) => {
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
                <b className="text-warning" key={i} title="product message">This product has been deleted.</b>
              );
            return (
              <tr key={i}>
                <td>
                  <b title="product title">{p.product.title}</b>
                </td>
                <td>
                  <p>
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
    <div className="col text-center">
      {orders.map((order) => {
        return (
          <div key={order._id} className="m-5 p-3 card">
            <ShowPaymentInfo order={order} showStatus={false} />
            <p className="mb-0">Order Status:</p>
            <div className="w-50 mx-auto">
              <select
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="form-control mb-4 pt-0"
                defaultValue={order.orderStatus}
                name="status"
              >
                <option value="Not Processed">Not Processed</option>
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="table-responsive">{showOrderInTable(order)}</div>
          </div>
        );
      })}
    </div>
  );
};
export default Orders;
