const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        // 🔹 Step 1: Check existing email if Google ID not found
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        // 🔹 Step 2: If user doesn’t exist at all → create new user
        if (!user) {
          user = new User({
            firstname: profile.name.givenName || "Google",
            lastname: profile.name.familyName || "User",
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value || "",
            googleId: profile.id,
            phoneNo: "0000000000", // placeholder
            address: "Google Account User",
            password: "Google@123", // dummy password
            loginType: "google",
          });

          await user.save({ validateBeforeSave: false });

          // ✅ Mark new user for welcome email
          user.isNewUser = true;
        } else {
          // Existing user (either normal or already Google-linked)
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save({ validateBeforeSave: false });
          }
          user.isNewUser = false;
        }

        return done(null, user);
      } catch (error) {
        console.error("❌ Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

// 🔹 Session management
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
