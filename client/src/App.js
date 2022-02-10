import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOutlined } from "@ant-design/icons";
import { currentUser } from "./utilities/auth";
import { handleError } from "./utilities/handleError";

//lazy imports
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const History = lazy(() => import("./pages/user/History"));
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCouponPage")
);
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const BrandCreate = lazy(() => import("./pages/admin/brand/BrandCreate"));
const BrandUpdate = lazy(() => import("./pages/admin/brand/BrandUpdate"));
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Payment = lazy(() => import("./pages/Payment"));

const Header = lazy(() => import("./components/nav/Header"));
const Footer = lazy(() => import("./components/nav/Footer"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const LoginRoute = lazy(() => import("./components/routes/LoginRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));
const CouponBanner = lazy(() => import("./components/coupon/CouponBanner"));

const App = () => {
  const dispatch = useDispatch();

  //check user's auth state through firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.token)
          currentUser(idTokenResult.token) //send the token to the backend
            .then((res) => {
              if (res.data)
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
            .catch((err) => {
              handleError(err);
            });
      }
    });
    //cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5 mt-5">
          <LoadingOutlined className="h1" />
        </div>
      }
    >
      <Header />
      <CouponBanner />
      <SideDrawer />
      <ToastContainer transition={Flip} />
      <Switch>
        <LoginRoute
          exact
          path="/login"
          component={Login} /*protected route: User must be logged out*/
        />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute
          exact
          path="/user/history"
          component={History} /*protected route*/
        />
        <UserRoute
          exact
          path="/user/password"
          component={Password} /*protected route*/
        />
        <UserRoute
          exact
          path="/user/wishlist"
          component={Wishlist} /*protected route*/
        />
        <UserRoute
          exact
          path="/checkout"
          component={Checkout} /*protected route*/
        />
        <UserRoute
          exact
          path="/payment"
          component={Payment} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/dashboard"
          component={AdminDashboard} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/category"
          component={CategoryCreate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/brand"
          component={BrandCreate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/brand/:slug"
          component={BrandUpdate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/sub"
          component={SubCreate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/sub/:slug"
          component={SubUpdate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/product"
          component={ProductCreate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/products"
          component={AllProducts} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate} /*protected route*/
        />
        <AdminRoute
          exact
          path="/admin/coupon"
          component={CreateCouponPage} /*protected route*/
        />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub/:slug" component={SubHome} />
        <Route exact path="/shop/" component={Shop} />
        <Route exact path="/cart/" component={Cart} />
        <Route path="/" component={Home} />
      </Switch>
      <Footer />
    </Suspense>
  );
};

export default App;
