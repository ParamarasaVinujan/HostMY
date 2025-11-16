const { createReview, getReviews, deleteReview, getMyReviews } = require('../controllers/reviewController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authonticate');
const router = require('express').Router();


router.route('/review').put(isAuthenticatedUser,createReview);
router.route('/myreviews').get(isAuthenticatedUser,getMyReviews);

router.route('/admin/review').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteReview);
router.route('/admin/reviews').get(isAuthenticatedUser,authorizeRoles('admin'),getReviews);

module.exports = router;