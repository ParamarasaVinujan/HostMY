import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyReviews } from "../../actions/productAction";
import Loader from "../Navbar/Loader";
import { toast } from "react-toastify";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const MyReviewsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, myReviews = [] } = useSelector(
    (state) => state.productState
  );

  useEffect(() => {
    dispatch(getMyReviews());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    const filledStars = Array.from(
      { length: Math.floor(numericRating) },
      (_, i) => <AiFillStar key={`filled-${i}`} className="text-yellow-400 text-base" />
    );
    const emptyStars = Array.from(
      { length: 5 - Math.floor(numericRating) },
      (_, i) => <AiOutlineStar key={`empty-${i}`} className="text-gray-300 text-base" />
    );
    return [...filledStars, ...emptyStars];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 hover:text-gray-900 flex items-center gap-2 transition"
        >
          ← Back
        </button>

        <h2 className="text-center mb-10 text-4xl font-extrabold text-gray-800 tracking-wide">
          My Reviews
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : myReviews.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-16">
            You haven’t reviewed any products yet.
          </div>
        ) : (
          <div className="space-y-6">
            {myReviews.map((rev) => {
              const productName = rev?.productName || "Unnamed Product";
              const productImage =
                rev?.productImage?.image ||
                "https://via.placeholder.com/400x400?text=No+Image";
              const rating = Number(rev?.rating) || 0;
              const comment = rev?.comment || "No comment provided.";
              const reviewDate = formatDate(rev?.createdAt);

              return (
                <div
                  key={rev._id || Math.random()}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:flex sm:items-center sm:space-x-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={productImage}
                      alt={productName}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  {/* Review Details */}
                  <div className="mt-4 sm:mt-0 flex-1">
                    <h4 className="text-xl font-semibold mb-1 text-gray-800">
                      {productName}
                    </h4>

                    <div className="flex items-center mb-2">
                      {renderStars(rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {rating.toFixed(1)} / 5
                      </span>
                    </div>

                    <p className="text-gray-600 text-base leading-relaxed mb-3">
                      {comment}
                    </p>

                    <p className="text-sm text-gray-400">
                      Reviewed on{" "}
                      <span className="font-medium text-gray-500">
                        {reviewDate}
                      </span>
                    </p>
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

export default MyReviewsPage;
