// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
const rateLimit = require("express-rate-limit"); // ✅ added
const whishlistRoutes = require('./routes/wishlistRoutes');
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const orderRoute = require("./routes/order");
const reviewRoute = require("./routes/review");
const paymentRoute = require("./routes/payment");
const offerRoutes = require("./routes/offerProduct");
const adminRoutes = require("./routes/adminRoutes");
const errorMiddleware = require("./middleware/error");

const app = express();

// ✅ Initialize Passport (strategy is loaded below)
require("./config/passport");
app.use(passport.initialize());

// ✅ Configure CORS (optional: restrict origin in production)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Rate Limiter: limits repeated requests to auth routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
app.use("/api/v1/user/login", loginLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount routes
app.use("/api/v1", productRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", reviewRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", offerRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/v1', whishlistRoutes);

// ✅ Centralized Error Handling
app.use(errorMiddleware);

module.exports = app;
