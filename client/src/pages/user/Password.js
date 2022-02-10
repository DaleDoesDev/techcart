import React, { useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        toast.success("You have successfully updated your password.");
      })
      .catch((err) => {
        toast.error(err.message);
      });
    setLoading(false);
    setPassword("");
  };

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-control"
          placeholder="Enter updated password"
        />
        <br />

        <button
          className="btn btn-danger btn-raised"
          disabled={!password || password.length < 6 || loading}
        >
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="mt-3">Update Password</h4>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
