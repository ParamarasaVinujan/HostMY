import React from "react";

const ReviewList = ({ reviews }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 mt-16">
      <h3 className="text-xl font-semibold mb-2">Other's Reviews:</h3>
      <hr className="mb-4" />

      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="review-card mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
          >
            {/* ⭐ Star Rating */}
            <div className="relative inline-block text-yellow-400 text-xl mb-2">
              <div
                className="absolute top-0 left-0 overflow-hidden whitespace-nowrap text-yellow-400"
                style={{ width: `${(review.rating / 5) * 100}%` }}
              >
                ★★★★★
              </div>
              <div className="text-gray-300">★★★★★</div>
            </div>

            {/* 👤 Reviewer Name (SAFE) */}
            <p className="text-sm text-gray-700 mb-1 font-medium">
              by{" "}
              {review.user
                ? `${review.user.firstname || ""} ${review.user.lastname || ""}`
                : "Unknown User"}
            </p>

            {/* 💬 Comment */}
            <p className="text-gray-800">{review.comment}</p>

            <hr className="mt-3" />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewList;
