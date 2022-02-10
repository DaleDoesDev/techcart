import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

//history prop from react-router-dom
const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  //extract user from the redux state
  const { user } = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //firebase object
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success("Please check your email for a password reset link.");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? <h4>Loading...</h4> : <h4>Forgot Password</h4>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Please enter your email."
          autoFocus
        />
        <br />
        <button className="btn btn-danger btn-raised mb-5" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
