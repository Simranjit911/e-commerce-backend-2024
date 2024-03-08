import bcrypt from "bcryptjs"

export async function hashPass(password) {
    let salt = await bcrypt.genSalt(10);
    let hashPass = await bcrypt.hash(password, salt);
    return hashPass
}