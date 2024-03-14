import jwt from "jsonwebtoken";
import crypto from 'crypto'
import nodemailer from 'nodemailer'
export function getToken(id) {
    let key = process.env.SK;
    let jwtExp = process.env.JWT_EXPIRE;
    // convert to int
    let cookieExp = parseInt(process.env.COOKIE_EXPIRE)

    // Calculate the expiration time in milliseconds
    let expires = Date.now() + cookieExp * 24 * 60 * 60 * 1000;

    let options = {
        expires: new Date(expires),
        httpOnly: true,
        secure:true,
        sameSite:true
    };

    let data = {
        token: jwt.sign({ id }, key, { expiresIn: jwtExp }),
        options
    };

    return data;
}
export function generateResetToken() {
    let token = crypto.randomBytes(20).toString("hex")
    let tokenCrypto = crypto.createHash("sha256").update(token).digest("hex")
    return tokenCrypto

}
export async function sendResetMail(email, resetLink) {
    try {
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,            
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'E-Commerce Password Reset Request',
            text: `Click the following link to reset your password: ${resetLink}`
        };
        transporter.sendMail(mailOptions)
        .then(()=>console.log("Mail send"))
        .catch((e)=>console.log(e))
    } catch (error) {

        console.log(error)
        return
    }

}