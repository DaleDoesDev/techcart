import React, { useState, useEffect } from "react";
import {
  getProducts,
  getProductsCount, //returns the total number of all products in the db
  fetchProductsByFilter,
} from "../utilities/product";
import { getSubs } from "../utilities/sub";
import { getBrands } from "../utilities/brand";

import { getCategories } from "../utilities/category";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { Menu, Slider, Checkbox, Radio, Pagination } from "antd";
import Star from "../components/forms/StarFilter";

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterArg, setFilterArg] = useState("");
  const [price, setPrice] = useState([0, 0]); //price range
  const [categories, setCategories] = useState([]); //for menu display
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); //for user interaction
  // eslint-disable-next-line
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  // eslint-disable-next-line
  const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");

  //the 3 below are for pagination
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [paginationUsed, setPaginationUsed] = useState(false);

  //a selection of colors the admin may label the product as available in
  const colors = [
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
    "Red",
    "Gold",
    "Gray",
    "Green",
    "Orange",
    "Pink",
    "Purple",
  ];

  //once any filter option is set, it resets the state for the other filters and the pagination.*

  let dispatch = useDispatch();
  let { search } = useSelector((state) => {
    return state;
  });

  const { text } = search; //text from redux store

  //this is invoked everywhere that a filter is interated with
  const resetPaginationState = () => {
    setPage(1);
    setPaginationUsed(false);
  };

  //for pagination interaction
  const handleChange = (value) => {
    setPage(value);
    setPaginationUsed(true);
  };

  useEffect(() => {
    //if the user hasn't filtered anything yet (initial render)
    if (filterArg === "") {
      setLoading(true);

      getProductsCount()
        .then((res) => {
          setProductsCount(res.data);
        })
        .catch(() => setProductsCount(0));

      //just show 6 default products
      getProducts("sold", "desc", page, 6)
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
          if (paginationUsed === true) {
            let el = document.querySelector("#productsHeader");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        })
        .catch((err) => {
          setLoading(false);
        });

      //categories for the left side menu display
      getCategories().then((res) => setCategories(res.data));
      //subcategories for the left side menu display
      getSubs().then((res) => setSubs(res.data));
      //brands for the left side menu display
      getBrands().then((res) => {
        setBrands(res.data);
      });
    } else {
      //the user has interacted with a filter
      fetchProductsByFilter({ ...filterArg, page }).then((res) => {
        setProducts(res.data);
        if (paginationUsed === false) setProductsCount(res.data.length);
        let el = document.querySelector("#productsHeader");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [page, paginationUsed, filterArg]);

  //load products based on text search & default to all products if needed
  useEffect(() => {
    const delayed = setTimeout(() => {
      if (text !== "") {
        setPrice([0, 0]);
        setStar("");
        setBrand("");
        setColor("");
        setSub("");
        setSelectedCategoryIds([]);
        resetPaginationState();
        setFilterArg({ query: text });
      }
    }, 300);
    return () => clearTimeout(delayed); //cleanup
  }, [text]);

  //load products based on user-selected price range
  useEffect(() => {
    if (price.every((p) => p === 0) !== true) {
      //if a price has been selected...
      //price default: [0,0].
      const delayed = setTimeout(() => {
        dispatch({
          type: "SEARCH_QUERY",
          payload: { text: "" },
        });
        setSelectedCategoryIds([]);
        setStar("");
        setBrand("");
        setColor("");
        setSub("");
        resetPaginationState();
        setFilterArg({ price });
      }, 300);
      return () => clearTimeout(delayed); //cleanup
    }
  }, [price, dispatch]);

  //'value' arg is provided by the <Slider /> antd component
  const handleSlider = (value) => {
    //wipe the search bar's value when the user is querying based on price
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setSelectedCategoryIds([]);
    setStar("");
    setColor("");
    setBrand("");
    resetPaginationState();
    setPrice(value);
    setSub("");
  };

  const handleCategoryCheck = (e) => {
    //reset other states
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setColor("");
    setSub("");
    setBrand("");
    resetPaginationState();
    let inTheState = [...selectedCategoryIds]; //copy the state

    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); //-1 if not found

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      //remove this category from the state
      inTheState.splice(foundInTheState, 1);
    }

    setSelectedCategoryIds(inTheState);
    if (inTheState.length < 1) {
      setFilterArg("");
      //no filter is currently being used (this will cause default products to display)
    } else setFilterArg({ category: inTheState });
  };

  const showCategories = () =>
    categories.map((c) => {
      return (
        <div key={c._id}>
          <Checkbox
            onChange={handleCategoryCheck}
            className="pb-2 px-4"
            value={c._id}
            name="category"
            checked={selectedCategoryIds.includes(c._id)}
          >
            {c.name}
          </Checkbox>
          <br />
        </div>
      );
    });

  const handleStarClick = (num) => {
    //reset other states
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setSub("");
    setBrand("");
    setColor("");
    resetPaginationState();
    setSelectedCategoryIds([]);
    setStar(num);
    setFilterArg({ stars: num });
  };

  const showStars = () => {
    return (
      <div className="px-4 pb-2">
        <Star starClick={handleStarClick} numberOfStars={5} />
        <Star starClick={handleStarClick} numberOfStars={4} />
        <Star starClick={handleStarClick} numberOfStars={3} />
        <Star starClick={handleStarClick} numberOfStars={2} />
        <Star starClick={handleStarClick} numberOfStars={1} />
      </div>
    );
  };

  const showSubs = () => {
    return subs.map((s) => {
      return (
        <div
          key={s._id}
          title="subcategory"
          className="p-1 m-1 badge badge-secondary"
          onClick={() => handleSub(s)}
          style={{ cursor: "pointer" }}
        >
          {s.name}
        </div>
      );
    });
  };

  const handleSub = (subcategory) => {
    //reset other states
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setSelectedCategoryIds([]);
    resetPaginationState();
    setStar("");
    setColor("");
    setBrand("");
    setSub(subcategory);
    setFilterArg({ sub: subcategory });
  };

  const showBrands = () => {
    return brands.map((b, i) => {
      return (
        <Radio
          value={b}
          title="brand"
          name={b}
          key={i}
          checked={b === brand}
          onChange={handleBrand}
          className="pb-1 px-4"
        >
          {b.name}
        </Radio>
      );
    });
  };

  const handleBrand = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setSelectedCategoryIds([]);
    setSub("");
    resetPaginationState();
    setColor("");
    setStar("");
    setBrand(e.target.value);
    setFilterArg({ brand: e.target.value });
  };

  const showColors = () => {
    return colors.map((c, i) => {
      return (
        <Radio
          value={c}
          key={i}
          name={c}
          title="color"
          checked={c === color}
          onChange={handleColor}
          className="pb-1 px-4"
        >
          {c}
        </Radio>
      );
    });
  };

  const handleColor = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setSelectedCategoryIds([]);
    resetPaginationState();
    setSub("");
    setStar("");
    setBrand("");
    setColor(e.target.value);
    setFilterArg({ color: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 mt-3">
          <h4>Filter</h4>
          <hr className="mb-0" />
          <Menu
            defaultOpenKeys={["1", "2", "3", "4"]}
            mode="inline"
            className="mb-5"
          >
            <SubMenu //price
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> By Price
                </span>
              }
            >
              <div>
                <Slider
                  className="mx-4"
                  tipFormatter={(value) => `$${value}`}
                  range
                  title="price slider"
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>
            <SubMenu //stars
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> By Rating
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>
            <SubMenu //categories
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> By Category
                </span>
              }
            >
              <div>{showCategories()}</div>
            </SubMenu>
            <SubMenu //subcategories
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> By Subcategory
                </span>
              }
            >
              <div className="px-4">{showSubs()}</div>
            </SubMenu>
            <SubMenu //brands
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> By Brand
                </span>
              }
            >
              <div className="pr-4 py-3">{showBrands()}</div>
            </SubMenu>

            <SubMenu //color
              key="6"
              title={
                <span className="h6">
                  <BgColorsOutlined /> By Color
                </span>
              }
            >
              <div className="pr-4 py-3">{showColors()}</div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 mb-5">
          {loading ? (
            <h4 className="mt-3">Loading...</h4>
          ) : (
            <h4 className="mt-3" id="productsHeader">
              Products
            </h4>
          )}

          {products.length < 1 && <p>No matching products found.</p>}
          <div className="row pl-0">
            {products.map((p, i) => {
              if (i < 6)
                return (
                  <div key={p._id} className="col-md-4">
                    <ProductCard product={p} />
                  </div>
                );
              return "";
            })}
          </div>

          {productsCount > 0 && (
            <div className="row ">
              <nav className="col-md-4 offset-md-4 text-center pt-2 p-3">
                <Pagination //"value", below in the onChange, is coming from this antd component
                  current={page}
                  total={Math.round(productsCount / 6) * 10} //a max of 10 pagination links ever
                  onChange={(value) => handleChange(value)}
                />
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
