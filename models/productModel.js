import mongoose from "mongoose";
let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function (val) {
                return val.toString().length <= 8
            },
            message: "Price not more than 8 characters"
        }

    },
    ratings: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          
        },
        name: {
            type: String
        }
    }

    ,
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        maxLength: [4, "Stock can't exceed 4 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            rating: {
                type: Number,
                default: 0,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            reviewTime: {
                type: String,
                default: new Date().toLocaleString()
            }
        }
    ],
    isLatest: {
        type: Boolean,
        default: false
    },
    isRecom: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: new Date().toLocaleString()
    }

}, {
    timestamps: true
})

let productModel = new mongoose.model("product", productSchema)
export default productModel