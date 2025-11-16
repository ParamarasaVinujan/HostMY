import { createSlice } from "@reduxjs/toolkit";

const offerSlice = createSlice({
    name: 'offer',
    initialState: {
        products:[],
        offetProducts:[],
        adminProducts :[],
        newOfferProduct:{},
        loading: false,
        isOfferCreated:false
        
    },
    reducers: {
        offersRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        offersSuccess(state, action) {
            return {
                ...state,
                loading: false,
                products: action.payload.products
            }
        },
        offersFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        offersGetRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        offersGetSuccess(state, action) {
            return {
                ...state,
                loading: false,
                offetProducts: action.payload.products
            }
        },
        offersGetFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        offersAdminRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        offersAdminSuccess(state, action) {
            return {
                ...state,
                loading: false,
                adminProducts : action.payload.products
            }
        },
        offersAdminFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        newOfferRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        newOfferSuccess(state,action){
            return{
                ...state,
                loading:false,
                newOfferProduct:action.payload.product,
                isOfferCreated:true
            }
        },

        newOfferFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload,
            }
        },
        clearOfferCreated(state,action){
            return{
                ...state,
                isOfferCreated:false
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        }
        

    }
});

const { actions, reducer } = offerSlice;

export const { 
    offersRequest,
    offersSuccess,
    offersFail,
    offersGetRequest,
    offersGetSuccess,
    offersGetFail,
    offersAdminRequest,
    offersAdminSuccess,
    offersAdminFail,
    newOfferRequest,
    newOfferSuccess,
    newOfferFail,
    clearOfferCreated,
    clearError,
    
 } = actions;

export default reducer;

