
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

//ceate order
export async function createOrder(req, res) {
    try {
        let { userDetails, user, orderedItems } = req.body
        user = req.user._id

        userDetails.user = req.user._id
        userDetails.name = req.user.name

        orderedItems.map(async (item) => {
            let product = await productModel.findById(item.productId)
            console.log(product, product.stock)
            product.stock -= item.qty
            await product.save({ validateBeforeSave: false })
        })

        let order = await orderModel.create({ ...req.body })
        res.status(200).json({ msg: "Order created!", order })



    } catch (error) {
        console.log(error)
    }
}

//get single order
export async function getSingleOrder(req, res) {
    try {
        let order = await orderModel.findById(req.params.id).populate("user", "name email")
        if (!order) {
            return res.status(404).json({ msg: "Order not Found with this Id!" })
        }
        return res.status(200).json({ msg: "Order  Found !", order })


    } catch (error) {
        console.log(error)
    }
}
// logged user orders
export async function getLoggedUserOrder(req, res) {
    try {
        let order = await orderModel.find({ user: req.user._id })
        if (!order) {
            return res.status(404).json({ msg: "Order not Found with this Id!" })
        }
        return res.status(200).json({ msg: "Order  Found !", order, total: order.length })


    } catch (error) {
        console.log(error)
    }
}

export async function getAllOrder(req, res) {
    try {
        let orders = await orderModel.find();
        if (!orders.length) {
            return res.status(404).json({ msg: "No orders found!" });
        }

        // Calculate total amount by summing up totalPrice from each order
        let totalAmount = orders.reduce((total, order) => total + order.totalPrice, 0);

        return res.status(200).json({ msg: "All orders found!", orders, total: orders.length, totalAmount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function updateOrder(req, res) {
    try {
        let { orderId } = req.query
        let checkorderExists = await orderModel.findById(orderId)

        if (!checkorderExists) {
            return res.status(404).json({ msg: "Invalid Order Id" })
        } else {

            let order = await orderModel.findByIdAndUpdate(orderId, req.body, { new: true })
            res.status(200).json({ msg: "Order Updated", order })
        }



    } catch (error) {
        console.log(error)
    }
}
export async function deleteOrder(req, res) {
    try {
        let id = req.params.id;
        console.log(id);

        let order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        } else {
            let { orderedItems } = order;
            for (let item of orderedItems) {
                let product = await productModel.findById(item.productId);
                if (product) {
                    product.stock += item.qty;
                    await product.save({ validateBeforeSave: false });
                }
            }
            let del = await orderModel.deleteOne({ _id: id });
            res.status(200).json({ msg: "Order cancelled!", del });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
