import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
  return (
    <nav className="mt-3 mb-5">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/product" className="nav-link">
            Create Product
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/products" className="nav-link">
            View All Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/category" className="nav-link">
            Manage Categories
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/sub" className="nav-link">
            Manage Subcategories
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/brand" className="nav-link">
            Manage Brands
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/coupon" className="nav-link">
            Manage Coupons
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/password" className="nav-link">
            Update Password
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
