const Product=require('../models/productModel')
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require('../middleware/catchAsyncError')
const ApiFeatures=require('../utils/ApiFeatures')
exports.getAllProducts=catchAsyncErrors(async (req,res)=>{
    // const products=await Product.find()
    const perPage=3
    const Apifeature=new ApiFeatures(Product.find(),req.query)
                .search().filter().pagination(perPage)
      const products=await Apifeature.query
    res.status(200).json({
        success:true, products
    })
}
)
exports.createProduct=catchAsyncErrors(async(req,res)=>{
  const product= await Product.create(req.body)
  res.status(200).json({
    success:true,
    product
  })
})

exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{
    const id=req.params.id.trim()
    let product=await Product.findById(id)
    if(!product){
    //     res.status(400).json({
    //         success:false,
    //         message:"Product not found"
    //   })
    return next(new ErrorHandler("Product not found", 404));
     }
    else{
    product=await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true, useFindAndModified:false})
      res.status(200).json({
        success:true,
        product
      })
    }
})

exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{
    const id=req.params.id.trim()
    let product=await Product.findById(id)
    if(!product){
    //     res.status(400).json({
    //         success:false,
    //         message:"Product not found"
    //   })
    return next(new ErrorHandler("Product not found",404))
    }
    else{
    await product.remove()
      res.status(200).json({
        success:true,
        message:"Product deleted successfully"
      })
    }
})

exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{
  const id=req.params.id.trim()
  let product=await Product.findById(id)
  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }
  else{
      res.status(200).json({
      success:true,
      product
    })
  }
})


// create new review or update review
exports.createProductReview=catchAsyncErrors(async(req,res)=>{
  const {rating,comment,productId}=req.body
  const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment  }
    const product=await Product.findById(productId)
     const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
    if(isReviewed){
      product.reviews.forEach(rev=>{
        if(rev.user.toString===req.user._id){
        rev.rating=rating,
        rev.comment=comment}
          })
    }
    else
    {
      product.reviews.push(review)
      product.numofReviews=product.reviews.length
    }
    let avg=0
    product.reviews.forEach(rev=>{
      avg=avg+rev.rating
    })
    product.ratings=avg/product.reviews.length
    await product.save({validateBeforeSave:false})

    res.status(200).json({
      success:true
    })
})


// Get All Reviews of a product
exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{
  const product=await Product.findById(req.query.id)

  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }
  res.status(200).json({
    sucess:true,
    reviews:product.reviews
  })
})

//delete review
exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{
  const product=await Product.findById(req.query.productId)

  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }
  const reviews=product.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString())
  let avg=0
  reviews.forEach(rev=>{
    avg+=rev.rating
  }) 
  const ratings=avg/reviews.length
  const numofReviews=reviews.length
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,ratings,numofReviews
  },{
    new:true,
    runValidators:true,
    useFindAndModified:false
  })
  res.status(200).json({
    sucess:true
  })
})










