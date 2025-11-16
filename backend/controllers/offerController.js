const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncError = require("../middleware/CatchAsyncError");

// Get all products with at least one active offer valid now (frontend)
exports.getOfferProducts = CatchAsyncError(async (req, res, next) => {
  const now = new Date();

  // Find products where at least one offer is active AND current date is within offerStartDate & offerEndDate
  const products = await productModel.find({
    offers: {
      $elemMatch: {
        active: true,
        offerStartDate: { $lte: now },
        offerEndDate: { $gte: now }
      }
    }
  });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

exports.getProductsByOfferType = CatchAsyncError(async (req, res, next) => {
  const now = new Date();
  const { offerType } = req.params;

  if (!offerType) {
    return next(new ErrorHandler("Offer type parameter is required", 400));
  }

  // Find products with at least one active offer matching offerType, valid now
  const products = await productModel.find({
    offers: {
      $elemMatch: {
        offerType,
        active: true,
        offerStartDate: { $lte: now },
        offerEndDate: { $gte: now },
      },
    },
  });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// Admin: Add or update an offer for a product

// Admin: Get all products with at least one offer (active, expired, or upcoming)
exports.getAdminOffersProducts = CatchAsyncError(async (req, res, next) => {
  // Fetch all products that contain at least one offer
  const products = await productModel.find({
    "offers.0": { $exists: true } // At least one offer in the array
  });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// If offerType already exists, update it; else add new offer
exports.addOrUpdateProductOffer = CatchAsyncError(async (req, res, next) => {
  const { offerType, offerPercentage, offerStartDate, offerEndDate, active } = req.body;

  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 400));
  }

  // Check if offer of this type already exists
  const existingOfferIndex = product.offers.findIndex(
    (offer) => offer.offerType === offerType
  );

  const newOffer = {
    offerType,
    offerPercentage,
    offerStartDate: new Date(offerStartDate),
    offerEndDate: new Date(offerEndDate),
    active: active !== undefined ? active : true,
  };

  if (existingOfferIndex >= 0) {
    // Update existing offer
    product.offers[existingOfferIndex] = { ...product.offers[existingOfferIndex]._doc, ...newOffer };
  } else {
    // Add new offer
    product.offers.push(newOffer);
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Offer added/updated successfully",
    product,
  });
});

// Admin: Remove specific offerType from a product with multiple offers
exports.removeProductOffer = CatchAsyncError(async (req, res, next) => {
  const { offerType } = req.body;

  if (!offerType) {
    return next(new ErrorHandler("Offer type is required to remove an offer", 400));
  }

  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  const originalOffersLength = product.offers.length;

  // Remove only the matching offerType
  product.offers = product.offers.filter((offer) => offer.offerType !== offerType);

  if (product.offers.length === originalOffersLength) {
    return next(new ErrorHandler(`Offer type '${offerType}' not found for this product`, 404));
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: `Offer '${offerType}' removed successfully from product`,
    product,
  });
});
