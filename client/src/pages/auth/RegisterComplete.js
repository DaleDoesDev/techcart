import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { createOrUpdateUser } from "../../utilities/auth";

const RegisterComplete = ({ history }) => {
  //the history object from react-router-dom
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    //validation
    if (!email || !password) {
      toast.error("Both an email and password are required.");
      return;
    } else if (password.length < 6) {
      toast.error("The password must be greater than 6 characters.");
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration"); //no longer needed

        //get the user and their token from firebase
        let user = auth.currentUser;
        await user.updatePassword(password); //assign their desired pw
        const idTokenResult = await user.getIdTokenResult();

        createOrUpdateUser(idTokenResult.token) //send the token to the backend
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => toast.error(err.message));
        history.push("/");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    let storedEmail = window.localStorage.getItem("emailForRegistration");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const completeRegistrationForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
        />
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder="Please enter a password"
        />
        <br />
        <button type="submit" className="btn btn-raised">
          Register
        </button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Complete Registration</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
