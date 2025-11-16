const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema({
  offerType: {
    type: String,
    required: true,
    enum: ['TodayOffer', 'FestivalOffer', 'FlashSale', 'Other'], // Customize offer types here
  },
  offerPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  offerPrice: {
    type: Number,
  },
  offerStartDate: {
    type: Date,
    required: true,
  },
  offerEndDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
});

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                'Electronics',
                'Accessories',
                'Clothes/Shoes',
                'Outdoor',
                'Home'
            ],
            message : "Please select correct category"
        }
    },
   
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [20, 'Product stock cannot exceed 20'],
        min:[0,"Stock cannot be negative"]
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    numOfReviews: {
        type: Number,
        default: 0
    },
    
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },


    // ✅ Offer Fields
    // Multiple offers field
    offers: [offerSchema]

    
},{timestamps:true});


productSchema.pre('save', function (next) {
  if (this.offers && this.offers.length > 0) {
    this.offers = this.offers.map(offer => {
      if (offer.offerPercentage > 0 && this.price) {
        offer.offerPrice = this.price - (this.price * offer.offerPercentage) / 100;
      } else {
        offer.offerPrice = undefined;
      }
      return offer;
    });
  }
  next();
});

const productModel = mongoose.model('Product',productSchema);
module.exports = productModel;