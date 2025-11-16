const express = require('express');
const router = express.Router();
const { isAuthenticatedUser} = require('../middleware/authonticate');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.route('/whishlist/add/:productId').post(isAuthenticatedUser,addToWishlist);
router.route('/whishlist/remove/:productId').delete(isAuthenticatedUser,removeFromWishlist);
router.route('/whishlist/all').get(isAuthenticatedUser,getWishlist);


module.exports = router;

