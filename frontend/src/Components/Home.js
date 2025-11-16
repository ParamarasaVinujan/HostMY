import React, { Fragment, useEffect } from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiSmartphone, FiMonitor, FiShoppingBag, FiHome, FiHeart } from "react-icons/fi";
import { GiClothes, GiLipstick, GiForkKnifeSpoon } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productAction";
import {
  getWishlist,
  removeFromWishlist,
  addToWishlist,
} from "../actions/wishlistActions";
import Loader from "../Components/Navbar/Loader";
import { toast } from "react-toastify";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products = [], loading } = useSelector(
    (state) => state.productsState
  );
  const { wishlist = [] } = useSelector((state) => state.wishlistState);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getWishlist());
  }, [dispatch]);

  const isInWishlist = (productId) =>
    wishlist.some((item) => (item.product?._id || item._id) === productId);

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    const inWishlist = isInWishlist(product._id);
    if (inWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info("Removed from wishlist 💔", { position: "top-right" });
    } else {
      dispatch(addToWishlist(product._id));
      toast.success("Added to wishlist ❤️", { position: "top-right" });
    }
  };

  const goToProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  // Extract unique categories
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  // Example icons map
  const categoryIcons = {
    Electronics: <FiSmartphone className="text-xl text-blue-500" />,
    Fashion: <GiClothes className="text-xl text-pink-500" />,
    Beauty: <GiLipstick className="text-xl text-rose-400" />,
    Home: <FiHome className="text-xl text-green-600" />,
    Grocery: <GiForkKnifeSpoon className="text-xl text-orange-500" />,
    Accessories: <FiShoppingBag className="text-xl text-purple-500" />,
    Wishlist: <FiHeart className="text-xl text-red-500" />,
    Default: <FiMonitor className="text-xl text-gray-400" />,
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
            🛒 Explore Our Products
          </h1>

          <div className="flex gap-6">
            {/* 🧭 Left Sidebar - Category Selector */}
            <div className="hidden sm:block w-1/5 bg-white shadow-md rounded-2xl p-4 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                <FiShoppingBag className="text-orange-500" /> Categories
              </h2>

              <ul className="space-y-3">
                {uniqueCategories.map((category, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                    className="group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-orange-50 transition-all duration-300"
                  >
                    <span className="transition-transform group-hover:scale-110">
                      {categoryIcons[category] || categoryIcons.Default}
                    </span>
                    <span className="text-gray-700 font-medium group-hover:text-orange-600">
                      {category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🛍️ Product Grid */}
            <div className="w-full sm:w-4/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center text-gray-600 font-medium">
                  No products available.
                </div>
              ) : (
                products.map((product) => {
                  const inWishlist = isInWishlist(product._id);
                  return (
                    <div
                      key={product._id}
                      onClick={() => goToProduct(product)}
                      className="relative cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-3 flex flex-col items-center"
                    >
                      {/* ❤️ Wishlist Icon */}
                      <div
                        onClick={(e) => toggleWishlist(e, product)}
                        className="absolute top-3 right-3 z-10 text-xl hover:scale-110 transition-transform"
                      >
                        {inWishlist ? (
                          <AiFillHeart className="text-red-500" />
                        ) : (
                          <AiOutlineHeart className="text-gray-400 hover:text-red-500" />
                        )}
                      </div>

                      {/* 🖼️ Product Image */}
                      <img
                        src={
                          product.images?.[0]?.url ||
                          product.images?.[0]?.image ||
                          product.images?.[0] ||
                          "/default.jpg"
                        }
                        alt={product.name}
                        className="w-full h-40 object-contain mb-3"
                      />

                      {/* 📦 Product Info */}
                      <h2 className="text-sm font-semibold text-center text-gray-800 mb-1">
                        {product.name}
                      </h2>
                      <p className="text-orange-600 text-sm font-bold">
                        Rs.{product.price?.toFixed(2)}
                      </p>

                      {/* ⭐ Ratings */}
                      <div className="flex items-center text-xs text-gray-600 mt-1 space-x-0.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const full = i < Math.floor(product.ratings);
                          const half =
                            i === Math.floor(product.ratings) &&
                            product.ratings % 1 >= 0.5;
                          return full ? (
                            <IoStar key={i} className="text-yellow-400" />
                          ) : half ? (
                            <IoStarHalf key={i} className="text-yellow-400" />
                          ) : (
                            <IoStarOutline key={i} className="text-gray-300" />
                          );
                        })}
                        <span className="ml-1">({product.numOfReviews})</span>
                      </div>

                      {/* 🛒 Buy Now Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToProduct(product);
                        }}
                        className="mt-3 bg-orange-500 text-white text-sm px-4 py-1.5 rounded-full shadow hover:bg-orange-600 transition"
                      >
                        Buy Now
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default HomePage;
