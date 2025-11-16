import { createSlice } from "@reduxjs/toolkit";

const categoryProductsSlice = createSlice({
  name: "categoryProducts",
  initialState: {
    loading: false,
    products: [],
    error: null,
  },
  reducers: {
    categoryProductsRequest: (state) => {
      state.loading = true;
      state.products = [];
    },
    categoryProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    categoryProductsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
});

export const {
  categoryProductsRequest,
  categoryProductsSuccess,
  categoryProductsFail,
  clearCategoryError,
} = categoryProductsSlice.actions;

export default categoryProductsSlice.reducer;
