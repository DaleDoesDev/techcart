import axios from "axios";

export const createProduct = async (product, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/product`, product, {
    headers: {
      authtoken,
    },
  });
};

export const removeProduct = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const getProduct = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/${slug}`);
};

export const updateProduct = async (product, slug, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/${slug}`,
    product,
    {
      headers: {
        authtoken,
      },
    }
  );
};

//a post request is used here for the purpose of passing options inside the req.body
export const getProducts = async (sort, order, page, count = 3) => {
  return await axios.post(`${process.env.REACT_APP_API}/products`, {
    //req.body
    sort,
    order,
    page,
    count,
  });
};

//get the total number of products in the db
export const getProductsCount = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/products/total`);
};

export const productStar = async (productId, star, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/star/${productId}`,
    { star }, //req.body.star
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getRelated = async (productId) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/product/related/${productId}`
  );
};

export const fetchProductsByFilter = async (arg) => {
  return await axios.post(`${process.env.REACT_APP_API}/search/filters`, arg);
};
