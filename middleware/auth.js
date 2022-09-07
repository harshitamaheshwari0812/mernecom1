const ErrorHandler = require("../utils/errorHandler");
const User=require('../models/userModel')
const catchAsyncErrors = require("./catchAsyncError");
const jwt=require('jsonwebtoken')
exports.isAuthUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies
    console.log(req.cookies)
    if(!token){
        return next(new ErrorHandler("Please Login to access products",401))
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET) 
    req.user=await User.findById(decodedData.id)
    next()
})

exports.authorizedRoles=(...roles)=>{ //[admin,vender,dealer]
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403))
        }
        next()
    }
}
