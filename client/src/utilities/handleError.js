import { toast } from "react-toastify";
import store from "../index";

export const handleError = (err) => {
  if (err.response) {
    if (err.response.status === 401) {
      //if there's a user in the data store, the token has simply expired -- refresh the page.
      if (store.getState().user !== null) {
        window.location.reload();
        return;
      }

      //if there's no user in state and this error is encountered:
      toast.error("You are not currently authorized to do that.", {
        toastId: "errorOne",
      });
    } else if (err.response.status === 400) {
      toast.error(err.response.data.error, {
        toastId: "errorTwo",
      });
    } else if (err.response.status === 404) {
      toast.error("Sorry, a resource could not be located. Error code: 404", {
        toastId: "errorThree",
      });
    } else
      toast.error("Sorry, that process could not be completed at this time.", {
        toastId: "errorFour",
      });
  } else
    toast.error(`Something went wrong: ${err.message}`, {
      toastId: "errorFive",
    });
  //cloudinary filesize error
};
