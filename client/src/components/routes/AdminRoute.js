import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../utilities/auth";
import { handleError } from "../../utilities/handleError";

const AdminRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setVerified(true);
        })
        .catch((err) => {
          setVerified(false);
          handleError(err);
        });
    }
  }, [user]);

  return verified ? <Route {...rest} /> : <LoadingToRedirect />;
};

export default AdminRoute;
