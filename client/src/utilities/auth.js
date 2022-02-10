import axios from "axios";

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/create-or-update-user`,
    {}, //empty body
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/current-user`,
    {}, //empty body
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  let link = `${process.env.REACT_APP_API}/current-admin`;
  return await axios.post(
    link,
    {}, //empty body
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};
