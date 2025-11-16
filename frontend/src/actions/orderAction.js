import axios from 'axios';
import {
  adminOrdersFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  createOrderFail,
  createOrderRequest,
  createOrderSuccess,
  deleteOrderFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  orderDetailFail,
  orderDetailRequest,
  orderDetailSuccess,
  updateOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  userOrdersFail,
  userOrdersRequest,
  userOrdersSuccess,
  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFail,
} from '../slices/orderSlice';

// ✅ Added: Axios default config (optional, ensures cookies are sent)
axios.defaults.withCredentials = true;

/* -------------------- CREATE ORDER -------------------- */
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`/api/v1/order/new`, order);
    dispatch(createOrderSuccess(data));
  } catch (error) {
    dispatch(createOrderFail(error.response.data.message));
  }
};

/* -------------------- USER ORDERS -------------------- */
export const userOrders = async (dispatch) => {
  try {
    dispatch(userOrdersRequest());
    const { data } = await axios.get(`/api/v1/myallorders`);
    dispatch(userOrdersSuccess(data));
  } catch (error) {
    dispatch(userOrdersFail(error.response.data.message));
  }
};

/* -------------------- ORDER DETAIL -------------------- */
export const orderDetail = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailRequest());
    const { data } = await axios.get(`/api/v1/order/${id}`);
    dispatch(orderDetailSuccess(data));
  } catch (error) {
    dispatch(orderDetailFail(error.response.data.message));
  }
};

/* -------------------- ADMIN: GET ALL ORDERS -------------------- */
export const adminGetOrders = async (dispatch) => {
  try {
    dispatch(adminOrdersRequest());
    const { data } = await axios.get(`/api/v1/admin/order/all`);
    dispatch(adminOrdersSuccess(data));
  } catch (error) {
    dispatch(adminOrdersFail(error.response.data.message));
  }
};

/* -------------------- ADMIN: DELETE ORDER -------------------- */
export const adminDeleteOrders = (id) => async (dispatch) => {
  try {
    dispatch(deleteOrderRequest());
    await axios.delete(`/api/v1/admin/order/${id}`);
    dispatch(deleteOrderSuccess());
  } catch (error) {
    dispatch(deleteOrderFail(error.response.data.message));
  }
};

/* -------------------- ADMIN: UPDATE ORDER -------------------- */
// ✅ FIXED: Missing closing curly brace was added here!
export const adminUpdateOrders = (id, orderData) => async (dispatch) => {
  try {
    dispatch(updateOrderRequest());
    const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData);
    dispatch(updateOrderSuccess(data));
  } catch (error) {
    dispatch(updateOrderFail(error.response.data.message));
  }
}; // ✅ ← Added this missing closing brace

/* -------------------- USER: CANCEL ORDER -------------------- */
export const cancelOrderAction = (orderId) => async (dispatch) => {
  try {
    dispatch(cancelOrderRequest());
    const { data } = await axios.put(`/api/v1/order/${orderId}/cancel`);
    dispatch(cancelOrderSuccess(data));
  } catch (error) {
    dispatch(cancelOrderFail(error.response.data.message));
  }
};

