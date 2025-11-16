import React, { Fragment, useEffect } from "react";
import { validateShipping } from "./ShippingInfo";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckOutStep";

const ConfirmOrder = () => {
  const { shippingInfo, items: cartItems } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 200 ? 0 : 25;
  let tax = Number(0.05 * subtotal);
  const total = (subtotal + shippingPrice + tax).toFixed(2);

  let taxPrice =tax.toFixed(2)
  const processPayment =()=>{
    const data={
      subtotal,
      shippingPrice,
      taxPrice,
      total
    }
    sessionStorage.setItem('orderInfo',JSON.stringify(data))
    navigate('/payment')
  }
  useEffect(() => {
    validateShipping(shippingInfo, navigate);
  }, [shippingInfo, navigate]);

  return (
    <Fragment>
      <CheckoutSteps shipping={true} confirmOrder={true} />
      <div className="container mt-5">
        <div className="row g-4">
          {/* Left Side */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="mb-4 border-bottom pb-2">Shipping Info</h4>
              <ul className="list-unstyled mb-4">
                <li><strong>Name:</strong> {user.firstname} {user.lastname}</li>
                <li><strong>Phone:</strong> {shippingInfo.phoneNo}</li>
                <li>
                  <strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.country}, {shippingInfo.postalcode}
                </li>
              </ul>

              <h4 className="mb-3 border-bottom pb-2">Your Cart Items</h4>
              {cartItems.map((item) => (
                <div key={item.product} className="d-flex align-items-center mb-3 border-bottom pb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: "65px", height: "45px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <Link to={`/product/${item.product}`} className="text-decoration-none fw-medium">
                      {item.name}
                    </Link>
                    <div className="text-muted small">
                     {item.quantity} x Rs. {Number(item.price || 0).toFixed(2)} = 
                      <strong>Rs. {(item.quantity * (item.price || 0)).toFixed(2)}</strong>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="col-12 col-lg-4">
            <div className="bg-white p-4 rounded shadow-sm border">
              <h4 className="mb-4 border-bottom pb-2">Order Summary</h4>
              <ul className="list-unstyled mb-4">
                <li className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>Rs. {subtotal.toFixed(2)}</strong>
                </li>
                <li className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <strong>Rs. {shippingPrice.toFixed(2)}</strong>
                </li>
                <li className="d-flex justify-content-between mb-2">
                  <span>Tax (5%):</span>
                  <strong>Rs. {tax.toFixed(2)}</strong>
                </li>
                <hr />
                <li className="d-flex justify-content-between fs-5">
                  <span>Total:</span>
                  <strong>Rs. {total}</strong>
                </li>
              </ul>

              <button onClick={processPayment} id="checkout_btn" className="btn btn-primary w-100 fw-bold">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
