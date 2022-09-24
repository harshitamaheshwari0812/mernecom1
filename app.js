const express=require('express')
const app=express()
const errorMiddleware=require('./middleware/error')
const cookieParser=require('cookie-parser')
const cors=require('cors')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
	
}))

const productRoute=require('./routes/productRoute')
const userRoute=require('./routes/userRoute')
const orderRoute=require('./routes/orderRoute')
//http://localhost:4000
app.use('/',productRoute) 
app.use('/',userRoute)
app.use('/',orderRoute)

app.use(errorMiddleware)

module.exports=app