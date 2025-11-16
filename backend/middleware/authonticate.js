const ErrorHandler = require("../utils/errorHandler");
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel');
const CatchAsyncError = require("./CatchAsyncError");

exports.isAuthenticatedUser =CatchAsyncError(async (req, res, next) =>{
  const { token  }  = req.cookies;
   
   if( !token ){
        return next(new ErrorHandler('Login first to handle this resource', 401))
   }

   const decoded = jwt.verify(token, process.env.Jwt_SECRET)
   req.user = await UserModel.findById(decoded.id)
    next();
})

exports.authorizeRoles = (...roles) => {
   return  (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
        }
        next()
    }
} 

