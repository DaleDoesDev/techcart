import React, { useState, useEffect } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { getOrders, changeStatus } from "../../utilities/admin";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleError } from "../../utilities/handleError";
import Orders from "../../components/order/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    getOrders(user.token)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => handleError(err));
  }, [user.token]);

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token)
      .then((res) => {
        toast.success("Order status updated successfully.", {
          toastId: "updateMsg",
        });
      })
      .catch((err) => handleError(err));
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>

          <div className="col">
            <h4 className="mt-3">Admin Dashboard</h4>
            <Orders
              title="orders"
              orders={orders}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
