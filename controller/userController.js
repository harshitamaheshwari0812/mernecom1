const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require('../middleware/catchAsyncError')
const User=require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendMail");
const crypto=require('crypto')
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body
    const user=await User.create({
        name,email,password,avatar:{public_id:"user1",url:"user1.jpg"}
    })
    // res.status(201).json({
    //     success:true,
    //     user
    //   })
    // const token=user.getJWTToken()
    // res.status(201).json({
    //     success:true,
    //     token
    //   })
    sendToken(user,200,res)
})

exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const{email,password}=req.body // ram@gmail.com and ram12345
    if(!email || !password){
        return next(new ErrorHandler("please enter email & password", 404));
    }
    const user=await User.findOne({email}).select("+password")
//ram@gmail.com and 123456
    if(!user){
        return next(new ErrorHandler("Invalid email & password", 404));
    }
    const ispwdmatched=await user.ComparePassword(password)
    if(!ispwdmatched){
        return next(new ErrorHandler("Invalid email & password", 404));
    }
    else{
    //     const token=user.getJWTToken()
    //     res.status(201).json({
    //     success:true,
    //     token
    //   })
        sendToken(user,201,res)

    }
})

exports.logoutUser=catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
      expires:new Date(Date.now()),httpOnly:true
    })
    res.status(200).json({
      success:true,
      message:"Logged Out"
    })
  })

  exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler('Invalid User'),404)
    }
   const resetToken= user.getResetPasswordToken()
   await user.save({validateBeforeSave:false})

   const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

   const msg= `You password reset token is :- ${resetPasswordUrl}, If you have not request this email then ignore it.`
   try{
    //sendmail code
        await sendEmail({
            email:user.email,
            subject:'Password Recovery Mail',
            msg
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
   }
   catch(error){
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message),500)
   }
  })

  exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });


exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  // update User password
  exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.ComparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  
  // update User Profile
  exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  });
  
  // Get all users(admin)
  exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  
  // Get single user (admin)
  exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  // update User Role -- Admin
  exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Delete User --Admin
  exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
        await user.remove()
      res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });















