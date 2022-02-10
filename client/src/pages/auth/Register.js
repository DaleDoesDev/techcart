import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

const Register = ({ history }) => {
  const [email, setEmail] = useState("");

  //extract user from the redux state
  const { user } = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //firebase object
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(email, config); //this is firebase
    toast.success(
      `The email has been sent to ${email}. Please click the link to complete your registration.`
    );
    window.localStorage.setItem("emailForRegistration", email); //save the user's email in local storage for later use
    setEmail(""); //clear the state
  };

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit} className="text-center mx-auto">
        <legend className="text-left">Register</legend>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          placeholder="Email"
        />
        <br />
        <button
          type="submit"
          className="mx-auto btn btn-danger btn-raised mb-3 mt-2"
        >
          Register
        </button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4 className="logo text-danger display-1 mb-0 text-center">
            TechCart
          </h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
