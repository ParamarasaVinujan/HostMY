import React from 'react';
import { Link } from 'react-router-dom';
import defaultSuccessImage from '../../image/success.png'; // default fallback image

const OrderSuccess = ({ imageSrc }) => {
  const imgSrc = imageSrc || defaultSuccessImage;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
      <div
        className="card shadow-lg p-5 text-center"
        style={{ maxWidth: 480, width: '100%', borderRadius: '12px' }}
      >
        <img
          src={imgSrc}
          alt="Order Success"
          className="mx-auto mb-4"
          style={{
            width: 130,
            height: 130,
            objectFit: 'contain',
            animation: 'bounceIn 1s ease',
          }}
        />
        <h2 className="text-success mb-3 fw-bold">Order Successful!</h2>
        <p className="text-secondary mb-4 fs-5">
          Thank you for your purchase. Your order has been placed successfully and will be processed soon.
        </p>
        <Link
          to="/orders"
          className="btn btn-success px-5 py-2 fw-semibold shadow-sm"
          style={{ fontSize: '1.1rem', borderRadius: '8px' }}
        >
          View My Orders
        </Link>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          60% {
            opacity: 1;
            transform: scale(1.1);
          }
          80% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
