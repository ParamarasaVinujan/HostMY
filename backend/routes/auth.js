const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const passport = require("passport");
const sendEmail = require("../utils/email");
require("../config/passport");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authonticate");

// ---------- Regular Auth Routes ----------
router.route("/user/register").post(upload.single("avatar"), registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").get(logoutUser);
router.route("/user/password/forgot").post(forgotPassword);
router.route("/user/password/reset/:token").post(resetPassword);
router.route("/user/myprofile").get(isAuthenticatedUser, getUserProfile);
router.route("/user/password/change").put(isAuthenticatedUser, changePassword);
router.route("/user/updateprofile").put(isAuthenticatedUser, upload.single("avatar"), updateProfile);

// ---------- Admin Routes ----------
router
  .route("/admin/user/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// ---------- Google Login & Register Routes ----------

// Redirect user to Google login
router.get(
  "/user/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // ✅ only account chooser, no re-consent
    accessType: "offline",
  })
);

// Google login callback
router.get(
  "/user/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    const token = user.getJwtToken();

    // ✅ Send welcome email if it's a new Google user
    if (user.isNewUser) {
      const message = `
        <div style="max-width:600px;margin:auto;padding:20px;
          background:#fff;border:1px solid #eee;
          border-radius:10px;font-family:Arial,sans-serif;color:#333;">
          <h2 style="color:#f97316;text-align:center;">Welcome to <strong>Mangala Showroom</strong>, ${user.firstname}!</h2>
          <p style="font-size:15px;line-height:1.6;text-align:center;">
            Thank you for joining our family! Your account has been created successfully.
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${process.env.FRONTEND_URL}/login"
               style="background-color:#f97316;color:#fff;
               padding:12px 24px;text-decoration:none;
               border-radius:6px;font-weight:bold;">
              Login Now
            </a>
          </div>
          <p style="font-size:15px;line-height:1.6;text-align:center;">
            Happy Shopping! 🛍️
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="text-align:center;font-size:13px;color:#888;">
            © ${new Date().getFullYear()} Mangala Showroom. All rights reserved.
          </p>
        </div>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to Mangala Showroom 🎉",
          message,
        });
      } catch (err) {
        console.error("Google Login Email Failed:", err.message);
      }
    }

    // ✅ Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true if HTTPS
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.redirect(`${process.env.FRONTEND_URL}/google/success?token=${token}`);
  }
);

// ---------- Google Register Routes ----------
router.get(
  "/user/google/register",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline",
  })
);

router.get(
  "/user/google/register/callback",
  passport.authenticate("google", {
    failureRedirect: "/register",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    const token = user.getJwtToken();

    // ✅ Send welcome email for new Google user
    if (user.isNewUser) {
      const message = `
        <div style="max-width:600px;margin:auto;padding:20px;
          background:#fff;border:1px solid #eee;
          border-radius:10px;font-family:Arial,sans-serif;color:#333;">
          <h2 style="color:#f97316;text-align:center;">Welcome to <strong>Mangala Showroom</strong>, ${user.firstname}!</h2>
          <p style="font-size:15px;line-height:1.6;text-align:center;">
            Thank you for joining our family! Your account has been created successfully.
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${process.env.FRONTEND_URL}/login"
               style="background-color:#f97316;color:#fff;
               padding:12px 24px;text-decoration:none;
               border-radius:6px;font-weight:bold;">
              Login Now
            </a>
          </div>
          <p style="font-size:15px;line-height:1.6;text-align:center;">
            Happy Shopping! 🛍️
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="text-align:center;font-size:13px;color:#888;">
            © ${new Date().getFullYear()} Mangala Showroom. All rights reserved.
          </p>
        </div>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to Mangala Showroom 🎉",
          message,
        });
      } catch (err) {
        console.error("Google Registration Email Failed:", err.message);
      }
    }

    // ✅ Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.redirect(`${process.env.FRONTEND_URL}/google/success?token=${token}`);
  }
);

module.exports = router;
