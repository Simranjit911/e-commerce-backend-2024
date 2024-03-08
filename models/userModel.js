import mongoose from "mongoose";
import validate from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validate.isEmail, "Enter Valid Email"]
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})



let userModel = new mongoose.model("user", userSchema)
export default userModel