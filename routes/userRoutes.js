import express from 'express'
import { registerUser,loginUser, logoutUser, updateUser, forgetPassword, resetPassword, getProfile, getAllUsers, getOneUser, updateUserRole, deleteUser } from '../controllers/userController.js'
import { isAuth, verifyAdmin } from '../middleware/auth.js'

let userRouter=express.Router()
//Without auth routes
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logoutUser)
userRouter.post("/forgetpassword",forgetPassword)
userRouter.post("/resetpassword/:token",resetPassword)

//with auth routes
userRouter.post("/updateuser",isAuth,updateUser)
userRouter.post("/profile",isAuth,getProfile)

//Admin routes
userRouter.get("/admin/users/all",isAuth,verifyAdmin,getAllUsers)
userRouter.get("/admin/user/:id",isAuth,verifyAdmin,getOneUser)
userRouter.post("/admin/user/changerole/:id",isAuth,verifyAdmin,updateUserRole)
userRouter.delete
("/admin/user/delete/:id",isAuth,verifyAdmin,deleteUser)

export default userRouter