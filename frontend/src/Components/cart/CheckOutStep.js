import React from "react";
import { Link } from "react-router-dom";


export default function CheckoutSteps({ shipping, confirmOrder, payment }) {
  return (
    <div className="checkout-steps-container d-flex justify-content-center mt-5">
      <Step
        to="/shipping"
        label="Shipping Info"
        status={shipping ? (confirmOrder || payment ? "done" : "current") : "upcoming"}
      />
      <Step
        to="/order/confirm"
        label="Confirm Order"
        status={confirmOrder ? (payment ? "done" : "current") : "upcoming"}
      />
      <Step
        to="/payment"
        label="Payment"
        status={payment ? "current" : "upcoming"}
      />
    </div>
  );
}

const Step = ({ to, label, status }) => {
  return (
    <Link to={to} className={`checkout-step-link ${status}`}>
      <div className={`checkout-step ${status}`}>
        <div className="circle">
          {status === "done" ? <span>&#10003;</span> : null}
        </div>
        <span className="label">{label}</span>
      </div>
    </Link>
  );
};
