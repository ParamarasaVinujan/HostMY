import axios from "axios";
import {
  categoryProductsRequest,
  categoryProductsSuccess,
  categoryProductsFail,
} from "../slices/categoryProductsSlice";

// Fetch products by category
export const getProductsByCategory = (category) => async (dispatch) => {
  try {
    dispatch(categoryProductsRequest());

    const { data } = await axios.get(`/api/v1/product/category/${category}`);

    dispatch(categoryProductsSuccess(data.products));
  } catch (error) {
    dispatch(
      categoryProductsFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
