import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderCompleted } from '../../slices/cartSlice';
import { createOrder } from '../../actions/orderAction';
import { authClearError } from '../../actions/userAction';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: cartItems = [], shippingInfo = {} } = useSelector(state => state.cartState);
  const { user } = useSelector(state => state.authState);
  const { error } = useSelector(state => state.orderState);

  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const paymentMethod = sessionStorage.getItem('paymentMethod');

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'bottom-center',
        onOpen: () => {
          dispatch(authClearError());
        },
      });
    }
  }, [error, dispatch]);

  if (!orderInfo) {
    return <p className="text-center mt-5">No order information available.</p>;
  }

  const placeOrder = async () => {
    const orderData = {
      orderItems: cartItems,
      shippingInfo,
      paymentMethod,
      itemsPrice: orderInfo.itemsPrice,
      taxPrice: orderInfo.taxPrice,
      shippingPrice: orderInfo.shippingPrice,
      totalPrice: orderInfo.total,
    };

    if (paymentMethod === 'CashOnDelivery') {
      try {
        dispatch(createOrder(orderData));
        dispatch(orderCompleted());
        toast.success('Order placed with Cash on Delivery', { position: 'top-right' });
        navigate('/order/success');
      } catch (err) {
        toast.error('Failed to place order. Please try again.', { position: 'top-right' });
      }
    } else if (paymentMethod === 'Card') {
      const order_id = `ORD-${user._id}-${Date.now()}`;

      const payHereData = {
        merchant_id: '1231196',
        return_url: 'http://localhost:3000/order/success',
        cancel_url: 'http://localhost:3000/order/cancel',
        notify_url: 'http://localhost:8000/api/v1/payhere/callback',
        order_id,
        items: cartItems.map(i => i.name).join(', '),
        amount: orderInfo.total,
        currency: 'LKR',
        first_name: user.firstname,
        last_name: user.lastname,
        email: user.email,
        phone: shippingInfo.phoneNo,
        address: shippingInfo.address,
        city: shippingInfo.city,
        country: shippingInfo.country,
      };

      sessionStorage.setItem('pendingOrder', JSON.stringify({ ...orderData, order_id }));

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';

      Object.entries(payHereData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold text-primary">Review Your Order</h2>

      <div className="row g-4">
        {/* Cart Items Summary */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="mb-3 border-bottom pb-2">Cart Summary</h4>
              {cartItems.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {cartItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        {/* Image Thumbnail */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: 'contain',
                              marginRight: 15,
                              borderRadius: 6,
                              border: '1px solid #ddd',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              backgroundColor: '#f0f0f0',
                              marginRight: 15,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#999',
                              fontSize: 12,
                              borderRadius: 6,
                              border: '1px solid #ddd',
                            }}
                          >
                            No Image
                          </div>
                        )}

                        {/* Product Name and Qty */}
                        <div>
                          <strong className="d-block">{item.name}</strong>
                          <small className="text-muted">
                            Qty: {item.quantity} × Rs.{Number(item.price).toFixed(2)}
                          </small>
                        </div>
                      </div>

                      {/* Total price for this item */}
                      <span className="fw-semibold">Rs.{(item.quantity * item.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping Info */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="mb-3 border-bottom pb-2">Order Summary</h4>

              <div className="mb-3 d-flex justify-content-between">
                <span>Items Price:</span>
                <span>Rs.{(Number(orderInfo.itemsPrice) || 0).toFixed(2)}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <span>Tax Price:</span>
                <span>Rs.{(Number(orderInfo.taxPrice) || 0).toFixed(2)}</span>
              </div>
              <div className="mb-3 d-flex justify-content-between">
                <span>Shipping Price:</span>
                <span>Rs.{(Number(orderInfo.shippingPrice) || 0).toFixed(2)}</span>
              </div>
              <hr />
              <div className="mb-4 d-flex justify-content-between fs-5 fw-bold">
                <span>Total Price:</span>
                <span>Rs.{(Number(orderInfo.total) || 0).toFixed(2)}</span>
              </div>

              <h4 className="mb-3 border-bottom pb-2">Shipping Info</h4>
              <p className="mb-1"><strong>Name:</strong> {user?.firstname} {user?.lastname}</p>
              <p className="mb-1"><strong>Phone:</strong> {shippingInfo.phoneNo}</p>
              <p className="mb-1"><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.country}</p>

              <button
                className="btn btn-primary w-100 mt-4 fw-semibold"
                onClick={placeOrder}
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
