const CatchAsyncError = require('../middleware/CatchAsyncError');
const ErrorHandler = require('../utils/errorHandler')
const UserModel = require('../models/userModel');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/email')
const crypto = require('crypto');

//user register 
exports.registerUser =CatchAsyncError(async(req,res,next)=>{
  const { firstname, lastname, email, password, phone, address} = req.body;

  let avatar;
  if(req.file){
    avatar = `${req.protocol}://${req.host}/uploads/user/${req.file.originalname}`
  }

  //checking email
    let user = await UserModel.findOne({ email });
    if(user){
      return next(new ErrorHandler('User already exists',400));
    }

    // const avatarPath = req.file ? `/uploads/user/${req.file.filename}` : null;

    user = await UserModel.create({ firstname, lastname, email, password, phone, address, avatar});

    // ✅ Send welcome email
  try {
    const message = `
  <div style="max-width:600px;margin:auto;padding:20px;
      background:#fff;border:1px solid #eee;
      border-radius:10px;font-family:Arial,sans-serif;color:#333;">
    <h2 style="color:#f97316;text-align:center;">Welcome to <strong>Mangala Showroom</strong>, ${firstname}!</h2>
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


    await sendEmail({
      email: user.email,
      subject: "Welcome to Mangala Showroom 🎉",
      message,
    });
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }


    sendToken(user,201,res);
});

//user login api 
exports.loginUser = CatchAsyncError(async(req,res,next) => {
    const { email, password } = req.body;

    if(!email|| !password){
      return next(new ErrorHandler('Please enter email and password',400));
    }

    const user = await UserModel.findOne({ email }).select('+password');
    
    if(!user){
      return next(new ErrorHandler('Invalid credentials',401));
    }

    if(!await user.isValidPassword(password)){
      return next(new ErrorHandler('Invalid email or password',401));
    }

    sendToken(user,201,res);

  })


 
  //user logout api 

  exports.logoutUser = (req,res,next) => {
    res.cookie('token',null,{
      expires:new Date(Date.now()),
      httpOnly:true
    }).status(200).json({
      success:true,
      message:'Loggedout successfully!'
    })
  }

   
  // Forgot Password
exports.forgotPassword = CatchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Generate reset token
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL (Frontend)
  const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

  const message = `
    You have requested a password reset. 
    Please click the link below to reset your password:
    ${resetUrl}

    If you did not request this email, please ignore it.
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Mangala Showroom Password Recovery',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler('Email could not be sent', 500));
  }
});

// Reset Password
exports.resetPassword = CatchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Reset token is invalid or expired', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});



//Get User Profile
exports.getUserProfile = CatchAsyncError(async (req, res, next) => {
   const user = await UserModel.findById(req.user._id) 
   res.status(200).json({
        success:true,
        user
   })
})

//Change Password 
exports.changePassword  = CatchAsyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('+password');
    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success:true,
    })
 })

// update profile
exports.updateProfile = CatchAsyncError(async (req, res, next) => {
  const { firstname, lastname, email } = req.body;
  const avatarFile = req.file;

  // Change from const to let
  let updatedData = {
    firstname,
    lastname,
    email,
  };

  if (req.file) {
    const avatar = `${req.protocol}://${req.get("host")}/uploads/user/${req.file.originalname}`;
    updatedData = { ...updatedData, avatar };
  }

  const user = await UserModel.findByIdAndUpdate(req.user.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});


//Admin 

// 1.get all user
exports.getAllUser =CatchAsyncError(async(req,res,next)=>{
  const users = await UserModel.find();

  res.status(200).json({
    success:true,
    users
  })
})

//2.get specific user

exports.getUser =CatchAsyncError(async(req,res,next)=>{
  const user = await UserModel.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found with this is : ${req.params.id}`))
  }

  res.status(200).json({
    success:true,
    user
  })
})

//3. Update User - api/v1/admin/user/:id
exports.updateUser = CatchAsyncError(async (req, res, next) => {
    const newUserData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        role: req.body.role
    }

    const user = await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

//4. Delete User 
exports.deleteUser = CatchAsyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
    })
})