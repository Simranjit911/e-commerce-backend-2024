import productModel from "../models/productModel.js";
import { searchByCat, searchProd } from "../utils/apiFeatures.js";
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import deleteAllFilesInDirectory from "../utils/deleteFolder.js";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CN_CLOUD_NAME,
    api_key: process.env.CN_API_KEY,
    api_secret: process.env.CN_API_SECRET,
    secure: true,
});
// create product -admin
export async function createProduct(req, res) {
    try {
        req.body.createdBy = {
            id: req.user._id,
            name: req.user.name
        };

        if (req.body.imageUrl) {
            if (Array.isArray(req.body.images) && req.body.images.length > 0) {
                req.body.images[0].url = req.body.imageUrl;
            } else {
                req.body.images = [{ url: req.body.imageUrl, public_id: "1" }];
            }
            // Create product if imageUrl is provided
            let product = await productModel.create(req.body);
            console.log("prod", product); // Log the created product

            // Send a success response with the created product
            res.status(201).json({ msg: "Product created!", product });
        } else {
            let { file } = req.files; // Log uploaded files
            console.log(file);
            // Upload image to Cloudinary
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "products images",
            }).then(async (result) => {
                console.log(result);
                req.body.images = [{ url: result.secure_url, public_id: result.public_id }];
                let product = await productModel.create(req.body);

                deleteAllFilesInDirectory().then((rs) => {
                    return res.status(201).json({ msg: "Product created!", product });
                }).catch((er) => {
                    console.log(er);
                });
            }).catch((e) => {
                res.status(406).json({ msg: "Image upload failed!", e });
                console.log(e);
            });
            return
        }
    } catch (error) {
        // If an error occurs, log it and send a server error response
        console.log(error);
        res.status(500).json({ msg: "Error while creating product!", error });
    }
}
// update product -admin
export async function updateProduct(req, res) {
    try {
        let id = req.params.id;
       

        console.log(req.body);
        let product = await productModel.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ msg: "Product Updated!", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error while updating product!", error });
    }
}

// delete product -admin
export async function deleteProduct(req, res) {
    try {
        let id = req.params.id
        console.log(id)
        let product = await productModel.findByIdAndDelete(id)
        res.status(201).json({ msg: "Product deleted!", product })

    } catch (error) {
        res.status(500).json({ msg: "Error while creating product!", error })
    }
}


//All Users

// get one product
export async function getOneProduct(req, res) {
    try {
        let id = req.params.id
        let product = await productModel.findOne({ _id: id })
        res.status(200).json({ product })

    } catch (error) {
        res.status(500).json({ msg: "Error", error })
    }
}

// get all product with filters
export async function getAllProduct(req, res) {
    try {
        console.log("query", req.query)
        const { name, desc, rating, isRecom, isNew, isLatest, price, resultsPerPage = 6, page = 1, category } = req.query;
        let filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        if (desc) {
            filter.desc = { $regex: desc, $options: 'i' };
        }
        if (rating) {
            filter.rating = { $gte: parseInt(rating) };
        }
        if (isRecom) {
            filter.isRecom = isRecom.toLowerCase() === 'true'; // Converting string to boolean
        }
        if (isNew) {
            filter.isNew = isNew.toLowerCase() === 'true'; // Converting string to boolean
        }
        if (isLatest) {
            filter.isLatest = isLatest.toLowerCase() === 'true';
        }
        if (price) {
            filter.price = { $lte: parseInt(price) };
        }
        console.log(filter)
        let skip = (page - 1) * resultsPerPage
        let products = await productModel.find(filter).limit(resultsPerPage).skip(skip)
        let totalProducts = await productModel.countDocuments()

        res.status(200).json({ msg: "Products found!", products, totalProducts });
    } catch (error) {
        res.status(500).json({ msg: "Error while fetching products!", error });
    }
}
//add review
export async function createProductReview(req, res) {
    try {
        const { rating, comment, productId } = req.body;

        // Find the product by ID
        const product = await productModel.findById(productId);
        // If product is not found, return an error
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        const userId = req.user._id;

        // Check if the user has already reviewed the product
        const existingReview = product.reviews.find(review => review.user.toString() === userId.toString());

        if (existingReview) {
            // Update existing review
            existingReview.rating = Number(rating);
            existingReview.comment = comment;
        } else {
            // Add new review
            product.reviews.push({
                user: userId,
                name: req.user.name,
                rating: Number(rating),
                comment
            });
        }

        // Calculate average rating and update numOfReviews
        const totalRating = product.reviews.reduce((total, review) => total + review.rating, 0);
        product.ratings = totalRating / product.reviews.length;
        product.numOfReviews = product.reviews.length;

        // Save the updated product
        await product.save();

        res.status(201).json({ msg: "Rating Added Successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error adding/updating review", error });
    }
}
export async function deleteReview(req, res) {
    try {
        // let { productid } = req.params
        let { reviewId, productId } = req.body
        let product = await productModel.findById(productid)
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        console.log(reviewId)
        product.reviews = product.reviews.filter((rev) => rev._id != reviewId)
        let len = product.reviews.length
        const totalRating = product.reviews.reduce((total, review) => total + review.rating, 0);
        product.ratings = totalRating / product.reviews.length;
        product.numOfReviews = len
        await product.save()
        return res.status(200).json({ msg: "Review Deleted!", product });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Review not Deleted!" });
    }
}
export async function getAllReviews(req, res) {
    try {
        let { pId } = req.body
        console.log(req.body)
        let product = await productModel.findById(pId)
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        res.status(200).json({ allreviews: product.reviews })

    } catch (error) {
        console.log(error)
    }
}