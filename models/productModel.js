const mongoose=require('mongoose')
const User=require('./userModel')
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter Product description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter price"],
        maxlength:[8,"price cannot exceed 8 char"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
    {
        img_id:{type:String,required:true},
        url:{type:String,required:true}
    }
    ],
    stock:{type:Number, required:[true, "Please enter stock"],default:1},
    category:{type:String,required:[true,"plase enter category"]},
    numofReviews:{type:Number,default:0},
    createdAt:{type:Date,default:Date.now},
    reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
        user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
              }
    
})

module.exports=mongoose.model("Product",productSchema)