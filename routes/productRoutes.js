import express from 'express'
import { createProduct, createProductReview, deleteProduct, deleteReview, getAllProduct, getAllReviews, getOneProduct, updateProduct } from '../controllers/productContoller.js'
import { isAuth, verifyAdmin } from '../middleware/auth.js'

let productRouter = express.Router()

//Admin
productRouter.post("/new",isAuth,verifyAdmin, createProduct)
productRouter.put("/update/:id",isAuth,verifyAdmin, updateProduct)
productRouter.delete("/delete/:id",isAuth,verifyAdmin, deleteProduct)

// All users
productRouter.get("/one/:id", getOneProduct)
productRouter.get("/all",getAllProduct)
productRouter.get("/getallreviews",isAuth,getAllReviews)
productRouter.put("/addreview",isAuth,createProductReview)
productRouter.delete("/deletereview/:productid",isAuth,deleteReview)

export default productRouter