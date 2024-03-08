import mongoose from "mongoose"
export default async function connectDb(url){
    try {      
        let res=await mongoose.connect(url)
        console.log("Db connect:",res.connection.host)
    } catch (error) {
        console.log(error)
    }
}