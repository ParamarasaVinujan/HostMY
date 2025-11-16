const catchAsyncError = require('../middleware/CatchAsyncError');
const crypto = require('crypto');

// Your sandbox merchant secret from PayHere dashboard
const MERCHANT_SECRET = 'MjQ4MTk4Mjk4MTM2NjY4NjI0MDczMTQxODgwNTYzMTY0OTgxNzE2OQ==';

exports.processPayment  = catchAsyncError(async(req, res, next) => {
    const {
    merchant_id,
    order_id,
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    method,
  } = req.body;

  // Verify MD5 signature
  const localMd5Sig = crypto
    .createHash('md5')
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto.createHash('md5').update(MERCHANT_SECRET).digest('hex')
    )
    .digest('hex')
    .toUpperCase();

  if (md5sig !== localMd5Sig) {
    console.warn('MD5 Signature mismatch. Rejecting callback.');
    return res.status(400).send('Invalid signature');
  }

  if (status_code === '2') {
    console.log(`✅ Payment SUCCESS for order ${order_id}`);
    // TODO: Update order status in your database as paid
  } else {
    console.log(`❌ Payment FAILED or CANCELLED for order ${order_id}`);
    // TODO: Update order status as failed/cancelled
  }

  res.status(200).send('OK');
})



