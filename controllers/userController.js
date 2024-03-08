import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { generateResetToken, getToken, sendResetMail } from "../utils/jwtFn.js";

import { hashPass } from "../utils/hashPass.js";

//user routes
export async function registerUser(req, res) {
    try {
        let { name, email, password, avatar } = req.body;

        // Check if the user already exists
        let findUser = await userModel.findOne({ email });
        if (findUser) {
            return res.status(400).json({ msg: "User Already Registered! Use another email" });
        }

        // Generate salt and hash the password
        let hashPassword = await hashPass(password)

        // Add user
        let newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            avatar: {
                public_id: "sample id",
                url: "sample url"
            }
        });

        // Get token
        let { options, token } = getToken(newUser._id);

        res.status(201).cookie("token", token, options).json({ msg: "User Registered!", newUser, token });
    } catch (error) {
        res.status(500).json({ msg: "User Registration Failed!", error });
    }
}
export async function loginUser(req, res) {
    try {
        let { password, email } = req.body
        let userExists = await userModel.findOne({ email })
        if (!userExists) {
            return res.status(404).json({ msg: "Invalid Email or Password" });
        }
        let passMatch = await bcrypt.compare(password, userExists.password)

        if (!passMatch) {
            return res.status(404).json({ msg: "Invalid Credentials" });
        }

        let { token, options } = getToken(userExists._id)

        res.status(200).cookie("token", token, options).json({ msg: "Login Successfull", userExists, token });


    } catch (error) {
        res.status(500).json({ msg: "Login Failed!", error });
    }
}

export async function logoutUser(req, res) {
    try {
        let options = {
            expires: new Date(0),
            httpOnly: true
        };

        // Remove the token cookie from the response
        res.cookie("token", null, options);

        // Send the response with a success message
        res.status(200).json({ msg: "Logout Successful" });
    } catch (error) {
        // Handle errors if any
        res.status(500).json({ msg: "Logout Failed!", error });
    }
}
export async function updateUser(req, res) {
    try {
        let user = req.user
        let { password } = req.body
        let hashPassword = await hashPass(password)
        req.body.password = hashPassword

        let updatedUser = await userModel.findByIdAndUpdate(user._id, req.body, { new: true })
        let { options, token } = getToken(updateUser._id);
        res.status(202).json({ msg: "User Updated!", updatedUser }).cookie("token", token, options)

    } catch (error) {
        console.log(error)
    }
}
export async function forgetPassword(req, res) {
    try {
        let { email } = req.body
        let user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        let token = generateResetToken()
        // Save token and expiration time to user document
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save()
        let resetLink = `${req.protocol}://${req.hostname}:8000/user/resetpassword/${token}`
        await sendResetMail(email, resetLink)

        res.status(200).json({ msg: "Mail send" })


    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Email not send!", error })
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null
        await user.save()

    }
}
export async function resetPassword(req, res) {
    try {
        let { token: tk } = req.params
        let { password } = req.body

        let user = await userModel.findOne({
            resetPasswordToken: tk,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }
        let hashPassword = await hashPass(password)

        // Update user's password
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;


        await user.save();
        res.status(200).json({ msg: 'Password reset successful' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error resetting password' });
    }
}
export async function getProfile(req, res) {
    try {
        let user = await userModel.findById(req.user.id).select("-password")
        res.status(200).json({ user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error while getting profile" })
    }
}

//Admin routers
export async function getAllUsers(req, res) {
    try {
        let allUsers = await userModel.find({})
        let totalsUsers = await userModel.countDocuments()
        res.status(200).json({ msg: "All Users", allUsers, totalsUsers })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error while getting all users" })
    }
}
export async function getOneUser(req, res) {
    try {
        let id = req.params.id
        let user = await userModel.findById(id)
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error while getting all users" })
    }



}
export async function updateUserRole(req, res) {
    try {
        let id = req.params.id
        let { role } = req.body
        let user = await userModel.findById(id)
        user.role = role
        await user.save()
        res.status(200).json({ msg: "User role updated!", user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error while updating role", error })
    }
}
export async function deleteUser(req, res) {
    try {
        let id = req.params.id
        let user = await userModel.findByIdAndDelete(id)

        res.status(200).json({ msg: "User Deleted!", user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error while updating role", error })
    }
}