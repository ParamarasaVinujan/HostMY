const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncError = require("../middleware/CatchAsyncError");

exports.addToWishlist = CatchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const user = await UserModel.findById(req.user._id);
  if (!user) return next(new ErrorHandler('User not found', 401));

  const product = await ProductModel.findById(productId);
  if (!product) return next(new ErrorHandler('Product not found', 404));

  if (user.wishlist.includes(productId)) {
    return res.status(400).json({ success: false, message: "Already in wishlist" });
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Added to wishlist",
    wishlist: user.wishlist,
  });
});

exports.removeFromWishlist = CatchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const user = await UserModel.findById(req.user._id);
  if (!user) return next(new ErrorHandler('User not found', 401));

  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
    wishlist: user.wishlist,
  });
});

exports.getWishlist = CatchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishlist");
  if (!user) return next(new ErrorHandler('User not found', 401));

  res.status(200).json({
    success: true,
    wishlist: user.wishlist,
  });
});
