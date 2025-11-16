import React, { Fragment, useEffect, useState } from "react";
import { IoStar, IoStarHalf, IoStarOutline, IoArrowBack } from "react-icons/io5";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  getSingleProduct,
  createReview,
} from "../../actions/productAction";
import { addCartItem } from "../../actions/cartAction";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../actions/wishlistActions";
import { clearReviewSubmitted } from "../../slices/productSlice";
import { clearError } from "../../slices/authSlice";
import ReviewList from "./ReviewList";
import Loader from "../Navbar/Loader";

const RatingStars = ({ rating, numOfReviews }) => (
  <div className="flex items-center space-x-1 text-sm">
    {Array.from({ length: 5 }).map((_, i) => {
      const full = i < Math.floor(rating);
      const half = i === Math.floor(rating) && rating % 1 >= 0.5;
      return full ? (
        <IoStar key={i} className="text-yellow-400" />
      ) : half ? (
        <IoStarHalf key={i} className="text-yellow-400" />
      ) : (
        <IoStarOutline key={i} className="text-gray-300" />
      );
    })}
    <span className="ml-1 text-gray-500">({numOfReviews || 0})</span>
  </div>
);

export default function SingleProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    product = {},
    fillerRelatedProducts = [],
    loading,
    error,
    isReviewSubmitted,
  } = useSelector((state) => state.productState);
  const { user } = useSelector((state) => state.authState);
  const { wishlist = [] } = useSelector((state) => state.wishlistState || {});

  const [qty, setQty] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const isInWishlist = wishlist.some((item) => item._id === product._id);

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].image);
    }
  }, [product]);

  useEffect(() => {
    if (isReviewSubmitted) {
      setShowReviewModal(false);
      toast.success("Review submitted!");
      dispatch(clearReviewSubmitted());
      dispatch(getSingleProduct(id));
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isReviewSubmitted, error, dispatch, id]);

  const increment = () => setQty((q) => (q < product.stock ? q + 1 : q));
  const decrement = () => setQty((q) => (q > 1 ? q - 1 : q));

  const submitReview = () => {
    if (rating === 0 || comment.trim() === "") {
      toast.warn("Provide both rating and comment.");
      return;
    }
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };

  const toggleWishlist = () => {
    if (!user) {
      toast.warn("Please log in to manage your wishlist.");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info("Removed from wishlist!");
    } else {
      dispatch(addToWishlist(product._id));
      toast.success("Added to wishlist!");
    }
  };

  const goToProduct = (p) => navigate(`/product/${p._id}`);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-orange-500 font-medium transition-all duration-200"
        >
          <IoArrowBack className="text-xl" />
          <span>Back</span>
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow">
          <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-center justify-center relative">

            {/* Wishlist Heart */}
            {user?.role !== "admin" && (
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 text-2xl"
              >
                {isInWishlist ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart className="text-gray-400 hover:text-red-500 transition" />
                )}
              </button>
            )}

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="max-h-80 max-w-full object-contain mb-5"
              />
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}

            {/* Thumbnails */}
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              {product.images?.map((imgObj, index) => (
                <div
                  key={index}
                  className={`h-16 w-16 p-1 border rounded cursor-pointer ${
                    selectedImage === imgObj.image ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => setSelectedImage(imgObj.image)}
                >
                  <img
                    src={imgObj.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {product.offers?.length > 0 && product.offers[0].active && (
              <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                {product.offers[0].offerType} - {product.offers[0].offerPercentage}% OFF
              </span>
            )}

            <RatingStars
              rating={Number(product.ratings)}
              numOfReviews={product.numOfReviews}
            />

            <p className="text-lg text-gray-700 mt-4 mb-6">{product.description}</p>

            {product.offers?.length > 0 && product.offers[0].active ? (
              <div className="mb-4">
                <p className="text-2xl font-bold text-red-600">
                  Rs.{product.offers[0].offerPrice?.toFixed(2)}
                </p>
                <p className="text-md line-through text-gray-500">
                  Rs.{product.price?.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-indigo-600 mb-4">
                Rs.{product.price?.toFixed(2)}
              </p>
            )}

            <p
              className={`font-medium mb-4 ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <label className="text-md font-semibold">Qty:</label>
              <div className="flex items-center border rounded-lg">
                <button onClick={decrement} disabled={qty === 1} className="px-3 py-1 text-xl">−</button>
                <span className="px-4 text-lg">{qty}</span>
                <button onClick={increment} disabled={qty === product.stock} className="px-3 py-1 text-xl">+</button>
              </div>
            </div>

            {user?.role !== "admin" && (
              <button
                onClick={() => {
                  const offerActive = product.offers?.[0]?.active;
                  const offerPrice = offerActive ? product.offers[0]?.offerPrice : null;
                  dispatch(addCartItem(product._id, qty, offerPrice));
                  toast.success("Cart Item Added!", { position: "top-right" });
                }}
                disabled={product.stock === 0}
                className="w-full md:w-52 bg-indigo-600 text-white py-3 me-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Add to Cart
              </button>
            )}

            {user && user.role !== "admin" ? (
              <button
                onClick={() => setShowReviewModal(true)}
                className="mt-3 w-full md:w-52 border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50"
              >
                Write a Review
              </button>
            ) : !user ? (
              <Alert variant="warning" className="mt-4">
                Please log in to write a review.
              </Alert>
            ) : null}
          </div>
        </div>

        {/* Related Products */}
        {fillerRelatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {fillerRelatedProducts.map((p) => {
                const isWishlisted = wishlist.some((item) => item._id === p._id);
                return (
                  <div
                    key={p._id}
                    onClick={() => goToProduct(p)}
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:-translate-y-1 transition-all relative"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isWishlisted) {
                          dispatch(removeFromWishlist(p._id));
                          toast.info("Removed from wishlist!");
                        } else {
                          dispatch(addToWishlist(p._id));
                          toast.success("Added to wishlist!");
                        }
                      }}
                      className="absolute top-2 right-2 text-xl"
                    >
                      {isWishlisted ? (
                        <AiFillHeart className="text-red-500" />
                      ) : (
                        <AiOutlineHeart className="text-gray-400 hover:text-red-500" />
                      )}
                    </button>

                    {p.images?.[0]?.image ? (
                      <img
                        src={p.images[0].image}
                        alt={p.name}
                        className="h-36 w-full object-contain"
                      />
                    ) : (
                      <div className="h-36 bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <h3 className="mt-3 text-sm font-semibold text-gray-700">{p.name}</h3>
                    <p className="text-sm font-bold text-orange-600">
                      Rs.{p.price?.toFixed(2)}
                    </p>
                    <RatingStars rating={Number(p.ratings)} numOfReviews={p.numOfReviews} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {product.reviews?.length > 0 && (
          <section className="mt-16">
            <ReviewList reviews={product.reviews} />
          </section>
        )}
      </div>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Your Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-center mb-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const val = i + 1;
              return (
                <span
                  key={i}
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(val)}
                  className="text-2xl cursor-pointer"
                >
                  {val <= (hoverRating || rating) ? (
                    <IoStar className="text-yellow-500" />
                  ) : (
                    <IoStarOutline className="text-gray-400" />
                  )}
                </span>
              );
            })}
          </div>
          <textarea
            rows={4}
            className="w-full border rounded p-3 focus:outline-none"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={submitReview}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
