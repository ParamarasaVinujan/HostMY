const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const CatchAsyncError = require('../middleware/CatchAsyncError');
const PRODUCTFeatures = require('../utils/productFeatures');


// Get all products EXCLUDING ones that are in active offer period
exports.getAllProducts = CatchAsyncError(async (req, res, next) => {
  const now = new Date();

  // Exclude products where at least one offer is active and within date range
  const productFeatures = new PRODUCTFeatures(
    productModel.find({
      $or: [
        { offers: { $exists: false } }, // No offers field
        {
          offers: {
            $not: {
              $elemMatch: {
                active: true,
                offerStartDate: { $lte: now },
                offerEndDate: { $gte: now },
              },
            },
          },
        },
      ],
    }),
    req.query
  )
    .search()
    .filter();

  const products = await productFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});



//get single product 
exports.getSingleProduct =CatchAsyncError(async(req,res,next)=>{
  const product = await productModel.findById(req.params.id).populate('reviews.user','lastname email');

  if(!product){
    return next(new ErrorHandler('Product not Found!',400));
  }

  const relatedProducts = await productModel.aggregate([
        {
          $match:{
            category:{$eq:product.category}
          }
        },
        {
          $sample:{
            size:10
          }
        }
  ])
  
  const fillerRelatedProducts = relatedProducts.filter((item)=>{
    return product._id.toString() !== item._id.toString();
  });
  
  res.status(202).json({
    success:true,
    product,
    fillerRelatedProducts
  })
})

exports.getCategoryProducts = CatchAsyncError(async (req, res, next) =>{
    const products = await productModel.find({ category: req.params.category });
    res.status(200).json({
        success: true,
        products
    })
});




//admin panel

exports.getAdminProducts = CatchAsyncError(async (req, res, next) =>{
    const products = await productModel.find();
    res.status(200).send({
        success: true,
        products
    })
});


exports.newProduct =CatchAsyncError(async(req,res,next)=>{
  let images =[];
  if(req.files.length>0){
    req.files.forEach(file=>{
      let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
      images.push({image:url})
    })
  }

  req.body.images=images;
  req.body.user = req.user.id;
  const product = await productModel.create(req.body);
  res.json({
    success:true,
    message:'create product successfully',
    product
  })
})
//delete product api 
exports.deleteProduct =CatchAsyncError(async(req,res,next)=>{
  let product = await productModel.findById(req.params.id);

  if(!product){
    return next(new ErrorHandler('Product not Found!',400));
   }

  await productModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success:true,
  })
})

//update product 
exports.updateProduct =CatchAsyncError(async(req,res,next)=>{
  let product = await productModel.findById(req.params.id);

  let images =[];

  if(req.body.imagesCleared === 'false'){
    images = product.images;
  }
  if(req.files.length>0){
    req.files.forEach(file=>{
      let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
      images.push({image:url})
    })
  }
  req.body.images=images;

  if(!product){
    return next(new ErrorHandler('Product not Found!',400));
  }

   product = await productModel.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })

  res.status(203).json({
    success:true,
    product
  })
})