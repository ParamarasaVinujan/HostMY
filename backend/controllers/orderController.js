const catchAsyncError = require('../middleware/CatchAsyncError');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');

//Create New Order 
exports.newOrder =  catchAsyncError( async (req, res, next) => {
     const {
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    paymentInfo,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler('No order items', 400));
  }

  const order = await orderModel.create({
  shippingInfo,
  orderItems,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  paymentMethod,
  paymentInfo: paymentMethod === 'Card' ? paymentInfo : {},
  paidAt: paymentMethod === 'Card' ? Date.now() : null,
  user: req.user._id,
});

// 📨 Send Order Confirmation Email
try {
  const sendEmail = require('../utils/email');
  const user = req.user;

  const message = `
  <div style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.7; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
        <img src="https://i.ibb.co/QDdWPMh/logo.png" alt="Mangala Showroom" style="height: 60px; border-radius: 50%; margin-bottom: 5px;" />
        <h2 className="text-gradient bg-gradient-to-r from-emerald-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold">
          MangalaShowRoom
        </h2>
      </div>

      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="color: #f97316ff;">Thank You for Your Order! 🎉</h2>
        <p style="margin: 10px 0;">Hello <strong>${user.firstname || "Customer"}</strong>,</p>
        <p>We’ve received your order <strong>#${order._id}</strong>. Here’s a quick summary:</p>

        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>📦 Total:</strong> Rs. ${order.totalPrice.toFixed(2)}</p>
          <p><strong>🏠 Shipping Address:</strong> ${order.shippingInfo?.address || "Not Provided"}</p>
          <p><strong>💳 Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <p>We’ll send you another email once your order is shipped.</p>
        <p style="margin-top: 15px;">You can check your order details anytime:</p>
        <a href="${process.env.FRONTEND_URL}/orders" 
          style="display: inline-block; background: linear-gradient(90deg, #f97316); color: white; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: bold;">
          View My Order
        </a>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #ddd;" />

        <p style="font-size: 13px; color: #666;">
          📍 Mangala Showroom, 536 Jaffna-Kankesanturai Rd, Jaffna 40000<br/>
          📞 +94 75 065 1916 | ✉️ <a href="mailto:mangalashowroom426@gmail.com" style="color: #f97316;">Mangalashowroom426@gmail.com</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #111827; color: #ccc; text-align: center; padding: 10px 0; font-size: 13px;">
        © ${new Date().getFullYear()} Mangala Showroom — All Rights Reserved
      </div>
    </div>
  </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `🛍️ Order Confirmation - #${order._id}`,
    message,
  });

  console.log(`📧 Order confirmation email sent to ${user.email}`);
} catch (err) {
  console.error("❌ Failed to send order confirmation email:", err.message);
}


  res.status(201).json({
    success: true,
    order,
  });
})

//Get Loggedin User Orders - myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({user: req.user.id});

  res.status(200).json({
      success: true,
      orders
  })
})

//Get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {

    const order = await orderModel.findById(req.params.id).populate('user');
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})





//Admin 

// 1.Get All Orders 
exports.orders = catchAsyncError(async (req, res, next) => {
    const orders = await orderModel.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


// 2. Update Order / Order Status 
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate('user', 'email firstname');

  if (!order) {
    return next(new ErrorHandler('Order not found!', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Order has been already delivered!', 400));
  }

  // Update stock for each order item
  for (const orderItem of order.orderItems) {
    await updateStock(orderItem.product, orderItem.quantity);
  }

  const updatedData = {
    orderStatus: req.body.orderStatus,
  };

  if (req.body.orderStatus === 'Delivered') {
    updatedData.deliveredAt = Date.now();
  }

  const updatedOrder = await orderModel.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  );

  // 📨 Send Email Notification to Customer
  const sendEmail = require('../utils/email');
  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color:#ff6600;">Mangala Showroom - Order Update</h2>
      <p>Dear ${order.user.firstname || "Customer"},</p>
      <p>Your order <strong>#${order._id}</strong> status has been updated to:</p>
      <h3 style="color:#28a745;">${req.body.orderStatus}</h3>
      <p>We’ll notify you once your order is delivered.</p>
      <p>Thank you for shopping with <strong>Mangala Showroom</strong>!</p>
      <hr/>
      <p style="font-size:13px; color:#555;">
        📦 <a href="${process.env.FRONTEND_URL}/orders" target="_blank">View your order</a><br/>
        📞 For support: +94 75 065 1916<br/>
        ✉️ Email: Mangalashowroom426@gmail.com
      </p>
    </div>
  `;

  try {
    await sendEmail({
      email: order.user.email,
      subject: `Your Order #${order._id} is now ${req.body.orderStatus}`,
      message,
    });
    console.log(`📧 Order update email sent to ${order.user.email}`);
  } catch (err) {
    console.error("❌ Failed to send order update email:", err.message);
  }

  res.status(200).json({
    success: true,
    order: updatedOrder,
  });
});


async function updateStock(productId, quantity) {
  const product = await productModel.findById(productId);
  if (!product) throw new Error("Product not found");

  const newStock = product.stock - quantity;

  if (newStock < 0) {
    throw new Error(`Insufficient stock for product ${product._id}`);
  }

  product.stock = newStock;
  await product.save({ validateBeforeSave: false });
}


// 3.Delete Order 
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    await order.deleteOne();
    res.status(200).json({
        success: true,
        message:"Deleted successfully"
    })
})
// Cancel Order
exports.cancelOrder = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Delivered order cannot be cancelled", 400));
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
        success: true
    });
});

