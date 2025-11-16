import React, { Fragment } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from '../../slices/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector((state) => state.cartState);
      const dispatch = useDispatch();
      const navigate = useNavigate();
  
      const increaseQty = (item) => {
          const count = item.quantity;
          if(item.stock ===0 ||  count >= item.stock) return;
          dispatch(increaseCartItemQty(item.product))
      }
      const decreaseQty = (item) => {
          const count = item.quantity;
          if(count === 1) return;
          dispatch(decreaseCartItemQty(item.product))
      }

      const checkoutHandler = ()=>{
        navigate('/login?redirect=shipping');
      }
  return (
    <Fragment>
      {items.length === 0 ? (
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Your Cart is Empty
        </h2>
      ) : (
        <div className="container mx-auto px-4 py-8 bg-[#f5f5f5] min-h-screen">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Your Cart: <span className="text-orange-500">{items.length} items</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-6xl mx-auto">
            {/* Cart Items Section */}
            <div className="w-full lg:w-3/4 space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    {/* Product Image */}
                    <div className="w-[100px] h-[100px]">
                      <img
                        src={item.image || "./images/products/1.jpg"}
                        alt="Product"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 font-medium leading-snug">
                        {item.name || "Product Name"}
                      </div>
                      <div className="text-md text-gray-700 font-semibold mt-2">
                        Rs .{item.price || "0.00"}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button onClick={()=>decreaseQty(item)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-black rounded" >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity || 1}
                        readOnly
                        className="w-12 text-center border border-gray-300 rounded h-8"
                      />
                      <button onClick={()=>increaseQty(item)} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-black rounded" >
                        +
                      </button>
                    </div>

                    {/* Delete Icon */}
                    <button onClick={() => dispatch(removeItemFromCart(item.product))} className="text-red-600 hover:text-red-800">
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="w-full lg:w-1/4 bg-white border border-gray-200 p-5 rounded-md shadow-sm h-fit">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h4>
              <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">
                  {items.reduce((acc, item) => acc + item.quantity, 0)} (Units)
                </span>
              </div>
              <div className="flex justify-between text-sm mb-4 text-gray-600">
                <span>Est. Total</span>
                <span className="font-semibold text-gray-800">
                  Rs .{items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}
                </span>
              </div>
              <button onClick={checkoutHandler} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold text-sm">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
