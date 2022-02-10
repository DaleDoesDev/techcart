import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter } from "react-router-dom";
import rootReducer from "./reducers";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import ScrollToTop from "./components/ScrollToTop";

const store = createStore(rootReducer, composeWithDevTools());
let el;
//the below block is for testing purposes
if (!document.getElementById("root")) {
  let el = document.createElement("div");
  el.setAttribute("id", "root");
  document.body.appendChild(el);
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop />
      <App className="main-container" />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root") || el
);

export default store;
//handleError.js uses store.getState() to read state. This is the only place useSelector is not used.
