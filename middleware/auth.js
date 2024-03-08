import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
export async function isAuth(req, res, next) {
    try {

        let { token } = req.cookies
        if (!token) {
            return res.status(404).json({ msg: "Please Login to Access" })
        }
        let verifyData = jwt.verify(token, process.env.SK)
        let user = await userModel.findOne({ _id: verifyData.id })
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
export async function verifyAdmin(req, res, next) {
    try {
        let user = req.user
   
        if (user && user.role === "admin") {
            next(); // Proceed to the next middleware
        } else {
            return res.status(403).json({ msg: "You are unauthorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
