// controllers/adminController.js
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.getAdminStats = async (req, res) => {
  try {
    // Total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total customers
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Low stock products (threshold < 10 for example)
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    // Total Products 
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        revenue: totalRevenue,
        orders: totalOrders,
        customers: totalCustomers,
        lowStock: lowStockProducts,
        products: totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ New controller: Monthly Revenue
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: { 
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          orderStatus: "Delivered"   // ✅ Filter only delivered orders
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Fill missing months with 0
    const result = Array(12).fill(0);
    monthlyRevenue.forEach((item) => {
      result[item._id.month - 1] = item.total;
    });

    res.status(200).json({
      success: true,
      monthlyRevenue: result,
    });
  } catch (error) {
    console.error('Error in getMonthlyRevenue:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// controllers/adminController.js

// 📌 Get Category-wise Sales Summary
exports.getCategorySales = async (req, res) => {
  try {
    // 1. Get ONLY delivered orders
    const deliveredOrders = await Order.find({ orderStatus: "Delivered" })
      .populate("orderItems.product", "category");

    // 2. Initialize category counts
    const categorySales = {
      Electronics: 0,
      Accessories: 0,
      Headphones: 0,
      Clothes: 0,
      Outdoor: 0,
      Home: 0,
    };

    // 3. Loop through all delivered orders
    deliveredOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const category = item.product.category;
        const qty = item.quantity;

        if (categorySales[category] !== undefined) {
          categorySales[category] += qty;
        }
      });
    });

    res.status(200).json(categorySales);
  } catch (error) {
    console.error("Category Sales Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};