import express from 'express'
import { createOrder, deleteOrder, getAllOrder, getLoggedUserOrder, getSingleOrder, updateOrder } from '../controllers/orderController.js'
import { verifyAdmin } from '../middleware/auth.js'

let orderRouter = express.Router()

orderRouter.post("/new", createOrder)
orderRouter.get("/me", getLoggedUserOrder)
orderRouter.get("/one/:id", getSingleOrder)


//Admin
orderRouter.get("/all", verifyAdmin,getAllOrder)
orderRouter.put("/update", verifyAdmin,updateOrder)
orderRouter.delete("/:id", verifyAdmin,deleteOrder)



export default orderRouter