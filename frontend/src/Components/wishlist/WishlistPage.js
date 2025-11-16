import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../actions/wishlistActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineHeart } from "react-icons/ai";
import { Button } from "react-bootstrap";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist = [], loading } = useSelector((state) => state.wishlistState);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.info("Removed from wishlist 💔", { position: "bottom-right" });
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-1">Your Wishlist</h1>
          <p className="text-gray-500 text-sm">
            Save your favorites and come back later.
          </p>
        </div>

        {/* Loading / Empty State / Wishlist Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-800"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <AiOutlineHeart className="text-5xl text-gray-300 mb-4" />
            <h2 className="text-base font-medium text-gray-700 mb-1">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              Browse products and tap the heart icon to save them.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const product = item.product || item;
              return (
                <div
                  key={product._id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    className="cursor-pointer bg-gray-50"
                    onClick={() => handleViewProduct(product._id)}
                  >
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.images?.[0]?.image ||
                        "/default.jpg"
                      }
                      alt={product.name}
                      className="w-full h-48 object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2 truncate">
                      {product.description?.slice(0, 40) || "No description"}
                    </p>
                    <p className="text-base font-semibold text-gray-900 mb-3">
                      Rs.{product.price?.toFixed(2)}
                    </p>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleViewProduct(product._id)}
                        className="w-[48%] bg-black text-white py-1.5 text-xs rounded-full hover:bg-gray-800 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="w-[48%] border border-gray-300 py-1.5 text-xs rounded-full hover:bg-gray-100 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
