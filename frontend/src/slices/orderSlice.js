import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orderDetail: {},
        userOrders: [],
        adminOrders: [],
        loading: false,
        isOrderDeleted: false,
        isOrderUpdated: false
    },
    reducers: {
        // ===== Create Order =====
        createOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        createOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                orderDetail: action.payload.order
            };
        },
        createOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            };
        },

        // ===== User Orders =====
        userOrdersRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        userOrdersSuccess(state, action) {
            return {
                ...state,
                loading: false,
                userOrders: action.payload.orders
            };
        },
        userOrdersFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },

        // ===== Order Detail =====
        orderDetailRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        orderDetailSuccess(state, action) {
            return {
                ...state,
                loading: false,
                orderDetail: action.payload.order
            };
        },
        orderDetailFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },

        // ===== Admin Orders =====
        adminOrdersRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        adminOrdersSuccess(state, action) {
            return {
                ...state,
                loading: false,
                adminOrders: action.payload.orders,
                totalAmount: action.payload.totalAmount,
            };
        },
        adminOrdersFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },

        // ===== Delete Order =====
        deleteOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        deleteOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isOrderDeleted: true
            };
        },
        deleteOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },

        // ===== Update Order =====
        updateOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        updateOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isOrderUpdated: true
            };
        },
        updateOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },

        clearOrderDeleted(state, action) {
            return {
                ...state,
                isOrderDeleted: false
            };
        },
        clearOrderUpdated(state, action) {
            return {
                ...state,
                isOrderUpdated: false
            };
        },

        // ===== Cancel Order =====
        cancelOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            };
        },
        cancelOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                orderDetail: {
                    ...state.orderDetail,
                    orderStatus: "Cancelled"
                }
            };
        },
        cancelOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
    }
});

const { actions, reducer } = orderSlice;

export const { 
    createOrderFail,
    createOrderSuccess,
    createOrderRequest,
    clearError,
    userOrdersFail,
    userOrdersSuccess,
    userOrdersRequest,
    orderDetailFail,
    orderDetailSuccess,
    orderDetailRequest,
    adminOrdersFail,
    adminOrdersRequest,
    adminOrdersSuccess,
    deleteOrderFail,
    deleteOrderRequest,
    deleteOrderSuccess,
    updateOrderFail,
    updateOrderRequest,
    updateOrderSuccess,
    clearOrderDeleted,
    clearOrderUpdated,
    cancelOrderRequest,
    cancelOrderSuccess,
    cancelOrderFail
} = actions;

export default reducer;
