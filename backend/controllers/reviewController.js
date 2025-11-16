const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/CatchAsyncError');

//Create Review
exports.createReview = CatchAsyncError(async (req, res, next) =>{
    const  { productId, rating, comment } = req.body;

    const review = {
        user : req.user.id,
        rating,
        comment
    }

    const product = await productModel.findById(productId);

   //finding user review exists
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //updating the  review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        })

    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    //average product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;

    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        message:"reviewed successfully"
    })


})

//Get Reviews - api/v1/reviews?id={productId}

exports.getReviews = CatchAsyncError(async (req, res, next) =>{
    const product = await productModel.findById(req.query.id).populate('reviews.user','firstname lastname email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Delete Review - api/v1/review
exports.deleteReview = CatchAsyncError(async (req, res, next) =>{
    const product = await productModel.findById(req.query.productId);
    
    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review => {
       return review._id.toString() !== req.query.id.toString()
    });

    //number of reviews 
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;

    //save the product document
    await productModel.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true,
        message:"Deleted successfully"
    })


});

// Get logged-in user's own reviews
exports.getMyReviews = CatchAsyncError(async (req, res, next) => {
  const products = await productModel
    .find({ "reviews.user": req.user.id })
    .populate("reviews.user", "firstname lastname email");

  let myReviews = [];

  products.forEach((product) => {
    const userReviews = product.reviews.filter(
      (r) => r.user._id.toString() === req.user.id.toString()
    );
    userReviews.forEach((r) => {
      myReviews.push({
        _id: r._id,
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0],
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      });
    });
  });

  res.status(200).json({
    success: true,
    myReviews,
  });
});
