import mongoose, { mongo } from "mongoose";

let orderSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user",required:true},
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: Number, required: true },
        phoneNo: { type: Number, required: true },
    },
    userDetails: {
        user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
        name: String
    }
    ,
    orderedItems: [
        {
            productId: {
                type: mongoose.Types.ObjectId, ref: "product", required: true
            },
            name: {
                type: String,
                required: true
            },
            qty: {
                type: Number, required: true
            },
            price: {
                type: Number, required: true
            },
            image: {
                type: String,
                required: true
            }


        }

    ]
    ,
    orderStatus: {
        type: String,
        // enum: ["not processed", "packed", "shipped", "delivered"],
        default: "not proccessed"
    },
    orderedTime: {
        type: String,
        default: new Date().toLocaleString()
    },
    paymentMethod: {
        type: String,
        enum: ["Cash on delivery", "Card"],
        default: "Cash on delivery"
    },
    isPaid: {
        type: String,
        default: "no"
    },
    paymentInfo: {
        id: {
            type: String,
            required: true

        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        default: Date.now
    },
    itemPrice: {
        type: Number,
        default: 0,
        required: true

    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true

    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true

    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true

    }

}, { timestamps: true })

let orderModel = mongoose.model("order", orderSchema)
export default orderModel