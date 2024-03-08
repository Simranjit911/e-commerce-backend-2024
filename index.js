import express from "express"
import dotenv from 'dotenv'
import connectDb from "./db.js"
import productRouter from "./routes/productRoutes.js"
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import orderRouter from "./routes/orderRoutes.js"
import { isAuth } from "./middleware/auth.js"
dotenv.config()


// variables
let app = express()
let port = process.env.PORT || 8000
let mongoUrl = process.env.MONGO_URL


// middlewares
app.use(express.json())
app.use(cookieParser())
app.get("/",(req,res)=>{
    res.send("hii")
})
//routes
app.use("/product",productRouter)
app.use("/user",userRouter)
app.use("/order",isAuth,orderRouter)



// db connect
connectDb(mongoUrl)
//listening
app.listen(port, () => console.log("Server running on port:", port))