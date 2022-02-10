import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import Search from "../forms/Search";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();

  //capture redux state data and destructure out the user
  let { user, cart } = useSelector((state) => {
    return state;
  });

  let history = useHistory();

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null, //set the user back to null
    });
    history.push("/login"); //can only be used in this component because of the react-router-dom hook useHistory
  };

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      selectedKeys={[current]}
      mode="horizontal"
      onClick={(e) => handleClick(e)}
    >
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      <Item key="cart">
        <Link to="/cart">
          <Badge
            count={cart.length}
            offset={[9, 0]}
            size="small"
            title={`There are ${cart.length} items in your shopping cart.`}
          >
            <ShoppingCartOutlined className="mr-2 text-success" />
            Cart
          </Badge>
        </Link>
      </Item>

      <Item key="search" className="pr-0">
        <Search />
      </Item>

      <Item
        key="shop"
        className="ml-auto "
        icon={<ShoppingOutlined className="text-danger" />}
      >
        <Link to="/shop">Shop</Link>
      </Item>

      {
        //render if not signed in
        !user && (
          <Item key="register" icon={<UserAddOutlined />}>
            <Link to="/register" title="register">
              Register
            </Link>
          </Item>
        )
      }

      {
        //render if not signed in
        !user && (
          <Item key="login" icon={<UserOutlined />}>
            <Link to="/login">Login</Link>
          </Item>
        )
      }
      {user && (
        <SubMenu
          icon={<SettingOutlined />}
          title={user.email && user.email.split("@")[0]}
          key="username"
        >
          {user &&
            user.role === "subscriber" && ( //return JSX if all true
              <Item key="dashboardU">
                <Link to="/user/history">Dashboard</Link>
              </Item>
            )}

          {user &&
            user.role === "admin" && ( //return JSX if all true
              <Item key="dashboardA">
                <Link to="/admin/dashboard" title="admin dashboard">
                  Dashboard
                </Link>
              </Item>
            )}

          <Item
            key="logout"
            title="logout"
            icon={<LogoutOutlined />}
            onClick={logout}
          >
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default Header;
