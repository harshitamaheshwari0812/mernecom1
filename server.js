const app=require('./app')
const dotenv=require('dotenv')
const connectDB = require('./config/databse')

process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)
    process.exit(1)     
})
//config
dotenv.config({path:'config/config.env'})
connectDB()
const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started on http://localhost:${process.env.PORT}`)
})
// unhandled promise rejections
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
})