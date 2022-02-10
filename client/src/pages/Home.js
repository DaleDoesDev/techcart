import React from "react";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/category/CategoryList";
import SubList from "../components/sub/SubList";

const Home = () => {
  return (
    <div className="container">
      <h4 className="text-danger text-center display-1 logo pb-0 mb-2 mt-5">
        TechCart
      </h4>

      <div className="mx-auto text-center">
        <span
          className="bg-dark text-white p-2 font-weight-light"
          style={{ fontSize: "20px" }}
        >
          lorem ipsum dolor sit amet
        </span>
      </div>

      <h4
        className="text-center p-2 mt-5 mb-5 h2 font-weight-light jumbotron"
        id="newArrivals"
      >
        Recent Additions
      </h4>
      <NewArrivals />
      <br />

      <h4
        className="text-center p-2 mt-5 mb-5 h2 font-weight-light jumbotron "
        id="bestSellers"
      >
        Best Sellers
      </h4>
      <BestSellers />
      <br />

      <h4 className="text-center p-2 mt-5 mb-3 h2 font-weight-light jumbotron">
        Browse Categories
      </h4>
      <CategoryList />
      <br />

      <h4 className="text-center p-2 mt-5 mb-3 h2 font-weight-light jumbotron">
        Shop Our Popular Subcategories
      </h4>
      <SubList />
      <br />
    </div>
  );
};

export default Home;
