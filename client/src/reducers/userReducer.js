export function userReducer(state = null, action) {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return action.payload;
    case "LOGOUT":
      //The payload will be used to blank-out the user data
      return action.payload;
    default:
      return state;
  }
}
