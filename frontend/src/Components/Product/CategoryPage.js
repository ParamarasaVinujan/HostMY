import React, { Fragment, useEffect, useState } from "react";
import { IoStar, IoStarHalf, IoStarOutline, IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByCategory } from "../../actions/categoryActions";
import Loader from "../Navbar/Loader";

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [rating, setRating] = useState(0);

  const { products = [], loading, error } = useSelector(
    (state) => state.categoryProductsState
  );

  useEffect(() => {
    dispatch(getProductsByCategory(category, { priceRange, rating }));
  }, [dispatch, category, priceRange, rating]);

  const goToProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      product.ratings >= rating
  );

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-center text-red-500 mt-10">{error}</p>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-4 sm:px-6 py-10">

          {/* 🔙 Professional Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-gray-700 hover:text-orange-500 font-medium transition-all duration-200"
          >
            <IoArrowBack className="text-xl" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
            🛍️ {category} Products
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* 🔹 Left Filter Sidebar */}
            <div className="bg-white rounded-2xl shadow p-5 h-fit lg:col-span-1">
              <h2 className="text-lg font-semibold mb-5 text-gray-700">
                Filters
              </h2>

              {/* 💰 Price Range */}
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-600">
                  Price Range (Rs.)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([0, parseInt(e.target.value)])
                  }
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0</span>
                  <span>{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* ⭐ Rating Filter */}
              <div>
                <label className="block font-medium mb-3 text-gray-600">
                  Customer Rating
                </label>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <div
                      key={r}
                      onClick={() => setRating(r)}
                      className={`flex items-center justify-between px-3 py-1 border rounded-lg cursor-pointer transition ${
                        rating === r
                          ? "bg-orange-100 border-orange-400"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IoStar
                            key={i}
                            className={`${
                              i < r ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({r}+)</span>
                    </div>
                  ))}
                </div>
                {rating > 0 && (
                  <button
                    onClick={() => setRating(0)}
                    className="mt-3 text-sm text-orange-500 hover:underline"
                  >
                    Clear Rating Filter
                  </button>
                )}
              </div>
            </div>

            {/* 🔸 Product Grid */}
            <div className="lg:col-span-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-500 text-lg font-medium">
                  No products found in {category}.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => goToProduct(product)}
                      className="relative cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-3 flex flex-col items-center"
                    >
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

                      <h2 className="text-sm font-semibold text-center text-gray-800 mb-1">
                        {product.name}
                      </h2>
                      <p className="text-orange-600 text-sm font-bold">
                        Rs.{product.price?.toLocaleString()}
                      </p>

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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CategoryPage;
