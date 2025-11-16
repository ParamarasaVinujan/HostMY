// src/pages/OrderCancel.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrderCancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
      <p className="text-lg mb-6">
        Your payment was not completed. If this was a mistake, please try again.
      </p>
      <Link to="/placeorder" className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700">
        Try Again
      </Link>
    </div>
  );
};

export default OrderCancel;
