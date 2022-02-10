import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const Search = () => {
  let dispatch = useDispatch();
  const { search } = useSelector((state) => {
    return state;
  });

  const { text } = search; //search text from the Redux store
  const history = useHistory();

  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop?${text}`);
  };

  return (
    <>
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="search"
          title="query"
          value={text}
          className="form-control mt-1 w-75"
          placeholder="Search products..."
        />
        <SearchOutlined
          style={{ cursor: "pointer", color: "#1890ff" }} //antd blue
          className="w-25 pt-3"
          onClick={handleSubmit}
        />
      </form>
    </>
  );
};

export default Search;
