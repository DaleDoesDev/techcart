import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../utilities/auth";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();

  const roleBasedRedirect = (res) => {
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
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
          roleBasedRedirect(res);
        });
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
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
            roleBasedRedirect(res);
          })
          .catch((err) => toast.error(err.message));
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <legend className="text-left">Login</legend>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="on"
          />
        </div>

        <button
          onClick={handleSubmit}
          title="submit button"
          className="btn btn-info btn-raised mt-2"
          disabled={!email || password.length < 6} //quick validation
        >
          <MailOutlined /> Login with Email
        </button>
      </form>
    );
  };

  return (
    <div className="container p-5 mb-4">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <h4 className="logo text-danger display-1 mb-0">TechCart</h4>
          )}
          {loginForm()}

          <button
            onClick={googleLogin}
            title="google button"
            className="btn btn-danger btn-raised mb-3 mt-2"
          >
            <GoogleOutlined /> Login with Google
          </button>
          <Link to="/forgot/password" className="d-block mt-4">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
