import { newOfferFail, newOfferRequest, newOfferSuccess, offersAdminFail, offersAdminRequest, offersAdminSuccess, offersFail, offersGetFail, offersGetRequest, offersGetSuccess, offersRequest, offersSuccess } from "../slices/offerSlice";
import { createReviewFail, createReviewRequest, createReviewSuccess, deleteProductFail, deleteProductRequest, deleteProductSuccess, deleteReviewFail, deleteReviewRequest, deleteReviewSuccess, myReviewsFail, myReviewsRequest, myReviewsSuccess, newProductFail, newProductRequest, newProductSuccess, productFail, productRequest, productSuccess, reviewsFail, reviewsRequest, reviewsSuccess, updateProductFail, updateProductRequest, updateProductSuccess } from "../slices/productSlice";
import { AdminproductsFail, AdminproductsRequest, AdminproductsSuccess, productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";
import axios from 'axios';


export const getProducts = (keyword = "", filters = {}) => async (dispatch) => {
  try {
    dispatch(productsRequest());

    let link = `/api/v1/product/all?`;

    if (keyword) {
      link += `keyword=${encodeURIComponent(keyword)}&`;
    }

    // Append filters if present
    if (filters.category) {
      link += `category=${encodeURIComponent(filters.category)}&`;
    }

    if (filters.priceRange && Array.isArray(filters.priceRange)) {
      // Assuming filters.priceRange = [min, max]
      // Your backend supports price[lte] query for max price
      link += `price[lte]=${filters.priceRange[1]}&`;
      // Optionally you can add price[gte] for min price if supported
      // link += `price[gte]=${filters.priceRange[0]}&`;
    }

    if (filters.rating) {
      link += `ratings[gte]=${filters.rating}&`;
    }

    // Remove trailing '&' or '?' if any
    link = link.endsWith("&") || link.endsWith("?") ? link.slice(0, -1) : link;

    const { data } = await axios.get(link);

    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFail(error.response?.data?.message || error.message));
  }
};

export const getSingleProduct =id => async(dispatch)=>{
  try {
    dispatch(productRequest())
    const {data} = await axios.get(`/api/v1/product/${id}`);
    dispatch(productSuccess(data))
  } catch (error) {
    dispatch(productFail(error.response.data.message))
  }
}

export const createReview = reviewData => async (dispatch) => {

    try {  
        dispatch(createReviewRequest()) 
        const config = {
            headers : {
                'Content-type': 'application/json'
            }
        }
        const { data }  =  await axios.put(`/api/v1/review`,reviewData, config);
        dispatch(createReviewSuccess(data))
    } catch (error) {
        
        dispatch(createReviewFail(error.response.data.message))
    }
    
}

//admin panel
export const getAdminProducts =async(dispatch)=>{
  try {
    dispatch(AdminproductsRequest())
    const {data} = await axios.get('/api/v1/admin/product/all');
    dispatch(AdminproductsSuccess(data))
  } catch (error) {
    dispatch(AdminproductsFail(error.response.data.message))
  }
}

export const createNewProducts =productData =>async(dispatch)=>{
  try {
    dispatch(newProductRequest())
    const {data} = await axios.post('/api/v1/admin/product/new',productData);
    dispatch(newProductSuccess(data))
  } catch (error) {
    dispatch(newProductFail(error.response.data.message))
  }
}

export const deleteProducts = id =>async(dispatch)=>{
  try {
    dispatch(deleteProductRequest())
    await axios.delete(`/api/v1/admin/product/${id}`);
    dispatch(deleteProductSuccess())
  } catch (error) {
    dispatch(deleteProductFail(error.response.data.message))
  }
}

export const updateProducts =(id,productData)=>async(dispatch)=>{
  try {
    dispatch(updateProductRequest())
    const {data} = await axios.put(`/api/v1/admin/product/${id}`,productData);
    dispatch(updateProductSuccess(data))
  } catch (error) {
    dispatch(updateProductFail(error.response.data.message))
  }
}

export const adminGetAllReviews =id =>async(dispatch)=>{
  try {
    dispatch(reviewsRequest())
    const {data} = await axios.get('/api/v1/admin/reviews',{params:{id}});
    dispatch(reviewsSuccess(data))
  } catch (error) {
    dispatch(reviewsFail(error.response.data.message))
  }
}

export const adminDeleteReview =(productId,id) =>async(dispatch)=>{
  try {
    dispatch(deleteReviewRequest())
    await axios.delete('/api/v1/admin/review',{params:{productId,id}});
    dispatch(deleteReviewSuccess())
  } catch (error) {
    dispatch(deleteReviewFail(error.response.data.message))
  }
}

export const getsOffers =async(dispatch)=>{
  try {
    dispatch(offersRequest())
    const {data} = await axios.get('/api/v1/offers');
    dispatch(offersSuccess(data))
  } catch (error) {
    dispatch(offersFail(error.response.data.message))
  }
}

export const getOfferTypeProducts =offerType =>async(dispatch)=>{
  try {
    dispatch(offersGetRequest())
    const {data} = await axios.get(`/api/v1/offers/${offerType}`);
    dispatch(offersGetSuccess(data))
  } catch (error) {
    dispatch(offersGetFail(error.response.data.message))
  }
}

//admin

export const adminGetAllProducts =async(dispatch)=>{
  try {
    dispatch(offersAdminRequest())
    const {data} = await axios.get('/api/v1/admin/products/offers');
    dispatch(offersAdminSuccess(data))
  } catch (error) {
    dispatch(offersAdminFail(error.response.data.message))
  }
}

export const createOffer =(productId,offerData )=>async(dispatch)=>{
  try {
    dispatch(newOfferRequest())
    const {data} = await axios.put(`/api/v1/admin/product/${productId}/offer`,offerData);
    dispatch(newOfferSuccess(data))
  } catch (error) {
    dispatch(newOfferFail(error.response.data.message))
  }
}

export const getMyReviews = () => async (dispatch) => {
  try {
    dispatch(myReviewsRequest());
    const { data } = await axios.get(`/api/v1/myreviews`);
    dispatch(myReviewsSuccess(data));
  } catch (error) {
    dispatch(myReviewsFail(error.response?.data?.message || error.message));
  }
};
