import productModel from "../models/productModel.js";

export async function searchProd(keyword) {
    try {
        let products = await productModel.find({
            $and: [
                {
                    name: { $regex: keyword, $options: 'i' }
                },
                {
                    desc: { $regex: keyword, $options: 'i' }
                }
            ]
        });
        return products
    } catch (error) {
        console.log(error)
        return error

    }

}
export async function searchByCat(cat) {
    try {
        let products = await productModel.find({ category: { $regex: cat, $options: 'i' } })
        return products
    } catch (error) {
        console.log(error)
        return { error }
    }
}