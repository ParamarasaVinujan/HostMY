import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import {
  orderDetail as orderDetailsAction,
  adminUpdateOrders,
} from "../../actions/orderAction";
import { clearError, clearOrderUpdated } from "../../slices/orderSlice";
import Loader from "../Navbar/Loader";
import { FiArrowLeft } from "react-icons/fi";

function UpdateOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const { loading, isOrderUpdated, error, orderDetail } = useSelector(
    (state) => state.orderState
  );

  const {
    orderItems = [],
    user = null,
    shippingInfo = {},
    totalPrice = 0,
    paymentMethod = "N/A",
    createdAt = null,
    orderStatus: currentStatus = "Processing",
  } = orderDetail || {};

  const [orderStatus, setOrderStatus] = useState("Processing");

  const steps = ["Processing", "Shipped", "Delivered", "Cancelled"];
  const currentStepIndex = steps.indexOf(orderStatus);

  useEffect(() => {
    if (isOrderUpdated) {
      toast.success("Order updated successfully!", {
        position: "top-right",
        onOpen: () => dispatch(clearOrderUpdated()),
      });
      navigate("/admin/orders");
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
    }

    dispatch(orderDetailsAction(orderId));
  }, [dispatch, orderId, isOrderUpdated, error, navigate]);

  useEffect(() => {
    if (orderDetail?._id) {
      setOrderStatus(orderDetail.orderStatus);
    }
  }, [orderDetail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminUpdateOrders(orderId, { orderStatus }));
  };

  const getStatusBadge = (status) => {
    let badgeClass = "secondary";
    if (status === "Processing") badgeClass = "warning";
    else if (status === "Shipped") badgeClass = "info";
    else if (status === "Delivered") badgeClass = "success";
    else if (status === "Cancelled") badgeClass = "danger";

    return <span className={`badge bg-${badgeClass}`}>{status}</span>;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 col-12 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 col-12 p-4">
          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-4 text-gray-600 hover:text-indigo-600 transition"
          >
            <FiArrowLeft className="mr-2 text-xl" /> Back to Orders
          </button>

          <h2 className="mb-4 text-center">Update Order</h2>

          {loading ? (
            <Loader />
          ) : (
            <div className="row gx-4">
              {/* Left Column */}
              <div className="col-lg-6 mb-4">
                {/* User Info */}
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Customer Information</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Name:</strong> {user?.firstname ?? "N/A"} {user?.lastname ?? ""}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {user?.email ? <a href={`mailto:${user.email}`}>{user.email}</a> : "N/A"}
                    </p>
                    {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    <p><strong>Phone:</strong> {shippingInfo?.phoneNo ?? "N/A"}</p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">Shipping Information</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Address:</strong>{" "}
                      {shippingInfo.address ?? "N/A"}, {shippingInfo.city ?? ""}
                      {shippingInfo.state ? `, ${shippingInfo.state}` : ""}
                      {shippingInfo.postalCode ? `, ${shippingInfo.postalCode}` : ""}
                      {shippingInfo.country ? `, ${shippingInfo.country}` : ""}
                    </p>
                  </div>
                </div>

                {/* Payment & Summary */}
                <div className="card shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <p><strong>Payment Method:</strong> {paymentMethod}</p>
                    <p><strong>Total Price:</strong> Rs. {totalPrice.toLocaleString()}</p>
                    <p><strong>Order Date:</strong> {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</p>
                    <p><strong>Status:</strong> {getStatusBadge(currentStatus)}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-6 mb-4">
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    {/* Stepper Preview */}
                    <div className="mb-4">
                      <h5 className="mb-2">Current Status</h5>
                      <div className="flex justify-between">
                        {steps.map((step, idx) => {
                          const completed = steps.indexOf(currentStatus) > idx;
                          const active = steps.indexOf(currentStatus) === idx;
                          return (
                            <div key={idx} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 font-bold text-white ${
                                  completed ? "bg-green-600" : active ? "bg-yellow-500" : "bg-gray-300"
                                }`}
                              >
                                {idx + 1}
                              </div>
                              <span className={`text-sm ${completed ? "text-green-600" : active ? "text-yellow-500" : "text-gray-400"}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Update Form */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="orderStatus" className="form-label">Update Status</label>
                        <select
                          id="orderStatus"
                          className="form-select"
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          required
                        >
                          {steps.filter((s) => s !== "Cancelled").map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="d-grid mb-4">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? "Updating..." : "Update Order"}
                        </button>
                      </div>
                    </form>

                    <h5>Order Items</h5>
                    <ul className="list-group">
                      {orderItems.length > 0 ? (
                        orderItems.map((item, index) => (
                          <li
                            className="list-group-item d-flex justify-content-between align-items-center"
                            key={index}
                          >
                            <div>
                              <strong>{item.name}</strong> <br />
                              Qty: {item.quantity} <br />
                              Price: Rs. {item.price.toLocaleString()}
                            </div>
                            <div>Rs. {(item.quantity * item.price).toLocaleString()}</div>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item">No items found.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateOrder;
