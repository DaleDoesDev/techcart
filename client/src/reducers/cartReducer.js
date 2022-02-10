let initialState = [];

//load any preexisting cart items
if (window.localStorage.getItem("cart")) {
  initialState = JSON.parse(window.localStorage.getItem("cart")); //arr of objects
}

export function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      return action.payload;
    default:
      return state;
  }
}
