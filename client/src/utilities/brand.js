import axios from "axios";

export const getBrands = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/brands`);
};

export const getBrand = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/brand/${slug}`);
};

export const removeBrand = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/brand/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const updateBrand = async (slug, brand, authtoken) => {
  return await axios.put(`${process.env.REACT_APP_API}/brand/${slug}`, brand, {
    headers: {
      authtoken,
    },
  });
};

export const createBrand = async (name, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/brand`,
    { name },
    {
      headers: {
        authtoken,
      },
    }
  );
};
