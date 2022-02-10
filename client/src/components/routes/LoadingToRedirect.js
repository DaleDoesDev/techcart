import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

//this is used to redirect an unauthorized person away from a page.
const LoadingToRedirect = () => {
  const [count, setCount] = useState(3);
  let history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count - 1);
    }, 1000);
    count === 0 && history.push("/");
    return () => clearInterval(interval);
  }, [count, history]);

  return (
    <div className="container p-5 text-center">
      <p>Redirecting you in {count} seconds...</p>
    </div>
  );
};

export default LoadingToRedirect;
