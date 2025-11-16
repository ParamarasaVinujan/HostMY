import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CheckoutSteps from './CheckOutStep';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) return alert('Please select a payment method');
    sessionStorage.setItem('paymentMethod', paymentMethod);
    navigate('/order/place');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <CheckoutSteps shipping confirmOrder payment />
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Select Payment Method</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="Card"
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <label htmlFor="card" className="text-sm text-gray-700">Credit / Debit Card</label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="CashOnDelivery"
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <label htmlFor="cod" className="text-sm text-gray-700">Cash on Delivery (Sri Lanka Only)</label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold text-sm"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
