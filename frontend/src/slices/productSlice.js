import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name:'product',
  initialState:{
    loading:false,
    product:{},
    fillerRelatedProducts: [],
    isReviewSubmitted: false,
    isProductCreated:false,
    isProductDeleted:false,
    isProductUpdated:false,
    isReviewDeleted:false,
    reviews:[],
    myReviews: [],

  },
  reducers:{
    productRequest(state,action){
      return{
        ...state,
        loading:true
      }
    },
    productSuccess(state,action){
      return{
        ...state,
        loading:false,
        product:action.payload.product,
        fillerRelatedProducts:action.payload.fillerRelatedProducts
      }
    },

    productFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload
      }
    },
    createReviewRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    createReviewSuccess(state, action){
      return {
        ...state,
        loading: false,
        isReviewSubmitted: true
      }
    },
    createReviewFail(state, action){
      return {
        ...state,
        loading: false,
        error:  action.payload
      }
    },
    clearReviewSubmitted(state, action) {
      return {
        ...state,
        isReviewSubmitted: false
      }
    },
    newProductRequest(state,action){
      return{
        ...state,
        loading:true
      }
    },
    newProductSuccess(state,action){
      return{
        ...state,
        loading:false,
        product:action.payload.product,
        isProductCreated:true
      }
    },

    newProductFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload,
      }
    },
    clearProductCreated(state,action){
      return{
        ...state,
        isProductCreated:false
      }
    },
    deleteProductRequest(state,action){
      return{
        ...state,
        loading:true
      }
    },
    deleteProductSuccess(state,action){
      return{
        ...state,
        loading:false,
        isProductDeleted:true
      }
    },

    deleteProductFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload,
      }
    },
    clearProductDeleted(state,action){
      return{
        ...state,
        isProductDeleted:false
      }
    },
    updateProductRequest(state,action){
      return{
        ...state,
        loading:true
      }
    },
    updateProductSuccess(state,action){
      return{
        ...state,
        loading:false,
        product:action.payload.product,
        isProductUpdated:true
      }
    },

    updateProductFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload,
        
      }
    },
    clearProductUpdated(state,action){
      return{
        ...state,
        isProductUpdated:false
      }
    },
    reviewsRequest(state,action){
      return{
        ...state,
        loading:true
      }
    },
    reviewsSuccess(state,action){
      return{
        ...state,
        loading:false,
        reviews:action.payload.reviews
      }
    },

    reviewsFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload
      }
    },
    deleteReviewRequest(state,action){
      return{
        ...state,
        loading:true
      }
    },
    deleteReviewSuccess(state,action){
      return{
        ...state,
        loading:false,
        isReviewDeleted:true
      }
    },

    deleteReviewFail(state,action){
      return{
        ...state,
        loading:false,
        error:action.payload,
      }
    },
    clearReviewDeleted(state,action){
      return{
        ...state,
        isReviewDeleted:false
      }
    },

    myReviewsRequest(state,action) {
      return { 
        ...state, 
        loading: true 
      };
    },
    myReviewsSuccess(state, action) {
      return { 
        ...state, 
        loading: false, 
        myReviews: action.payload.myReviews
      };
    },
    myReviewsFail(state, action) {
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    },

    clearError(state,action){
            return{
                ...state,
                error:null
            }
        }
  }
})

const {actions,reducer} = productSlice;

export const {productFail,productRequest,productSuccess,createReviewRequest,createReviewSuccess,createReviewFail,clearReviewSubmitted,newProductRequest,newProductSuccess,newProductFail,clearProductCreated,deleteProductRequest,deleteProductSuccess,deleteProductFail,clearProductDeleted,updateProductRequest,updateProductSuccess,updateProductFail,clearProductUpdated,reviewsRequest,reviewsSuccess,reviewsFail,deleteReviewRequest,deleteReviewSuccess,deleteReviewFail,clearReviewDeleted,myReviewsRequest,myReviewsSuccess,myReviewsFail,clearError} = actions;

export default reducer;