import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/whishlist/all");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/v1/whishlist/add/${productId}`);
      return { product: { _id: productId } };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error adding to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/whishlist/remove/${productId}`);
      return { productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error removing from wishlist");
    }
  }
);
