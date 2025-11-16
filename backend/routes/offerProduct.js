const express = require('express');
const router = express.Router();

const {
  getOfferProducts,
  addOrUpdateProductOffer,
  removeProductOffer,
  getProductsByOfferType,
  getAdminOffersProducts,
} = require('../controllers/offerController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authonticate');

// Public route: Get all products with active offers
router.route('/offers').get(getOfferProducts);
router.route('/offers/:offerType').get(getProductsByOfferType);

// Admin routes: Add/update or remove offer on a product
router.route('/admin/products/offers').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminOffersProducts);
router
  .route('/admin/product/:id/offer')
  .put(isAuthenticatedUser, authorizeRoles('admin'), addOrUpdateProductOffer)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), removeProductOffer);

module.exports = router;
