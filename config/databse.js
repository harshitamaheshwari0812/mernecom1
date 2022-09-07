const mongoose=require('mongoose')

const connectDB=()=>{
    mongoose.connect(process.env.DBURL)
.then((data)=>{console.log(`connect with server :${data.connection.host}`)})
}

module.exports=connectDB