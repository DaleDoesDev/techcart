import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const LoginRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => state);

  //redirect a user if they're already logged in
  return user && user.token ? <LoadingToRedirect /> : <Route {...rest} />;
};

export default LoginRoute;
