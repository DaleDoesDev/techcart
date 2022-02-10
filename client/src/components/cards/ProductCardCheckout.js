import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";
import { getProduct } from "../../utilities/product";
import { handleError } from "../../utilities/handleError";

//this card is used in the cart
//product as props
const ProductCardCheckout = ({ p }) => {
  const dispatch = useDispatch();
  //check the user cart for any deleted products
  React.useEffect(() => {
    let cart = [];
    let storedCart = localStorage.getItem("cart");

    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
    for (let i = 0; i < cart.length; i++) {

      getProduct(cart[i].slug)
        .then((res) => {
          if (res.data === null) {
            //remove this item from the cart, as it's no longer in the DB.
            cart.splice(i, 1);
            //update cart in storage
            localStorage.setItem("cart", JSON.stringify(cart));
            dispatch({
              type: "ADD_TO_CART",
              payload: cart,
            });
          }
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }, [dispatch]);

  //covers product count or color change, and remove
  const handleChange = (e, attribute) => {
    //count must be > 0
    let input = e.target.value;
    if (attribute === "count") {
      input = e.target.value < 1 ? 1 : e.target.value;
      if (input > p.quantity) {
        input = p.quantity;
        toast.error(`Max available quantity is: ${p.quantity}.`, {
          toastId: "quantityId",
        });
        return;
      }
    }

    let cart = [];

    let storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

    //update the affected product in the cart
    cart.map((product, i) => {
      //compare to component prop: 'p'
      if (product._id === p._id) {
        if (attribute === "remove") {
          return cart.splice(i, 1);
        } else return (cart[i][attribute] = input); //object[key] syntax
      } else return "";
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  return (
    <tbody>
      <tr>
        <td className="text-center align-middle">{p.title}</td>
        <td className="text-center align-middle">
          {p.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>

        <td className="text-center align-middle">
          <select
            onChange={(e) => handleChange(e, "selectedColor")}
            name="color"
            className="form-control"
            required
          >
            {p.selectedColor ? (
              <option value={p.selectedColor}>{p.selectedColor}</option>
            ) : (
              <option value="">Select</option>
            )}

            {p.colors
              .filter((c) => c !== p.selectedColor) //remove the selected color as a selection option
              .map((c, i) => {
                return (
                  <option value={c} key={c}>
                    {c}
                  </option>
                );
              })}
          </select>
        </td>
        <td className="text-center align-middle">
          <input
            data-testid="custom-element"
            type="number"
            className="form-control"
            value={p.count}
            onChange={(e) => handleChange(e, "count")}
          ></input>
        </td>
        <td className="text-center align-middle">
          <CloseOutlined
            className="text-danger pointer"
            onClick={(e) => handleChange(e, "remove")}
          />
        </td>
      </tr>
    </tbody>
  );
};
export default ProductCardCheckout;
