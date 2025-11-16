const {processPayment} = require('../controllers/paymentController')
const express = require('express');
const router = express.Router();


router.route('/payhere/callback').post(processPayment);

module.exports = router;
