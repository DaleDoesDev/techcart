import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
  const orderAmt = order.paymentIntent.amount / 100;
  const { name, email, address } = order.orderedBy;

  return (
    <div>
      <p>
        Order Id:{" "}
        <span className="font-weight-bold">{order.paymentIntent.id}</span>
      </p>
      <p>
        Amount:{" "}
        <span className="font-weight-bold" data-type="amount">
          {
            /*convert cents to dollars */ orderAmt.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              //the amount is stored in the db as cents, for Stripe
            })
          }
        </span>
      </p>
      <p>
        Ordered:{" "}
        <span className="font-weight-bold">
          {
            /*Stripe saves seconds since the Unix epoch. Convert to milliseconds for date display: */
            new Date(order.paymentIntent.created * 1000).toLocaleString()
          }
        </span>
      </p>

      <p>
        Username:<span className="font-weight-bold"> {name}</span>
      </p>
      <p>
        Email:<span className="font-weight-bold"> {email}</span>
      </p>
      <p>
        Address:
        <span className="font-weight-bold">
          {" "}
          {`${address.address}, ${address.zip}`}
        </span>
      </p>

      {showStatus && (
        <p>
          Order Status:{" "}
          <span className="font-weight-bold bg-primary text-white p-1 ml-2">
            {order.orderStatus}
          </span>
        </p>
      )}
    </div>
  );
};

export default ShowPaymentInfo;
