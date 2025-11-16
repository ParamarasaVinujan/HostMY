import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getOfferTypeProducts } from "../../actions/productAction";
import { toast } from "react-toastify";
import { clearError } from "../../slices/offerSlice";

const OfferTypeProductsPage = () => {
  const { offerType } = useParams();
  const dispatch = useDispatch();

  const { offetProducts = [], loading ,error} = useSelector(
    (state) => state.offerState
  );

  useEffect(() => {
    if(error){
      toast(error,{
        type:'error',
        position:'top-right',
        onOpen:()=>dispatch(clearError())
      })
    }
    dispatch(getOfferTypeProducts(offerType));
  }, [dispatch, offerType,error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-yellow-700 mb-8 text-center">
        {offerType} - Offer Products
      </h2>

      {loading ? (
        <p className="text-center text-lg font-semibold text-gray-700">
          Loading...
        </p>
      ) : offetProducts.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-600">
          No products found for this offer.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offetProducts.map((product) => {
            const activeOffer = product.offers?.find(
              (offer) =>
                offer.offerType === offerType &&
                offer.active &&
                new Date(offer.offerStartDate) <= new Date() &&
                new Date(offer.offerEndDate) >= new Date()
            );

            const discount = activeOffer?.offerPercentage || 0;
            const originalPrice = product.price;
            const discountedPrice =
              originalPrice - (originalPrice * discount) / 100;

            return (
              <div
                key={product._id}
                className="bg-white border rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col justify-between"
              >
                <img
                  src={product.images?.[0]?.image || "/default.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-contain p-4"
                />

                <div className="px-4 pb-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>

                  {discount > 0 ? (
                    <div className="space-y-1">
                      <p className="text-yellow-600 text-lg font-bold">
                        Rs. {discountedPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        Rs. {originalPrice.toFixed(2)}
                      </p>
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                        -{discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-800 text-lg font-medium">
                      Rs. {originalPrice.toFixed(2)}
                    </p>
                  )}

                  <Link
                    to={`/product/${product._id}`}
                    className="mt-3 inline-block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OfferTypeProductsPage;
