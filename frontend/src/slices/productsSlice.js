import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name:'products',
  initialState:{
    loading:false,
    products: []
  },
  reducers:{
    productsRequest(state,action){
      return{
        loading:true
      }
    },
    productsSuccess(state,action){
      return{
        loading:false,
        products:action.payload.products
      }
    },

    productsFail(state,action){
      return{
        loading:false,
        error:action.payload
      }
    },
    AdminproductsRequest(state,action){
      return{
        loading:true
      }
    },
    AdminproductsSuccess(state,action){
      return{
        ...state,
        loading:false,
        products:action.payload.products
      }
    },

    AdminproductsFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload
      }
    },

    clearError(state,action){
      return{
        ...state,
        error:null
      }
    }
  }
})

const {actions,reducer} = productsSlice;

export const {productsFail,productsRequest,productsSuccess,AdminproductsRequest,AdminproductsSuccess,AdminproductsFail,clearError} = actions;

export default reducer;