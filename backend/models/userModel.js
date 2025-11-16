const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter First Name"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Please enter Last Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [320, "Email cannot exceed 320 characters"],
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: function () {
        // password not required for Google users
        return this.loginType === "local";
      },
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [15, "Password cannot exceed 15 characters"],
      select: false,
      validate: {
        validator: function (val) {
          if (this.loginType === "google") return true; // skip for google users
          // Must contain uppercase, lowercase, number, and special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.loginType === "local"; // not required for google users
      },
      trim: true,
      validate: {
        validator: function (val) {
          if (!val && this.loginType === "google") return true;
          // Matches Sri Lankan numbers: +94xxxxxxxxx or 0xxxxxxxxx
          return /^(\+94|0)?[1-9][0-9]{8}$/.test(val);
        },
        message: "Please enter a valid phone number",
      },
    },
    address: {
      type: String,
      required: function () {
        return this.loginType === "local";
      },
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    role: {
      type: String,
      default: "user",
    },
    loginType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Wishlist
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    verificationToken: String,
    verificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  { timestamps: true }
);

//
// 🔐 Hash password before saving
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.loginType === "google") return next(); // Google users have no password hash
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//
// 🔑 Generate JWT Token
//
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

//
// 🔍 Compare Password
//
userSchema.methods.isValidPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//
// 🔁 Generate Reset Password Token
//
userSchema.methods.getResetToken = function () {
  // Generate Token
  const token = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Set token expire time (30 minutes)
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};

//
// 📧 Generate Email Verification Token
//
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
