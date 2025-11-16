import { createSlice } from "@reduxjs/toolkit";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../actions/wishlistActions";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist || [];
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist.push(action.payload.product);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const id = action.payload.productId;
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== id && item.product?._id !== id
        );
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
