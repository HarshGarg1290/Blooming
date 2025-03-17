import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productmodel.js";

const addProduct = async (req, res) => {
	try {
		const { name, description, price, sizes, features, washCare, images } =
			req.body;

		const productData = {
			name,
			description,
			price: Number(price),
			sizes: sizes,
			features: features,
			washCare: washCare,
			image: images, // Cloudinary URLs from frontend
			date: Date.now(),
		};

		const product = new productModel(productData);
		await product.save();

		res.json({ success: true, message: "Product Added" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const removeProduct = async (req, res) => {
	try {
		await productModel.findByIdAndDelete(req.body.id);
		res.json({ success: true, message: "product removed" });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

const listProduct = async (req, res) => {
	try {
		const products = await productModel.find({});

		res.json({ success: true, products });
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: error.message });
	}
};

const singleProduct = async (req, res) => {
	try {
		const { productId } = req.body;
		const product = await productModel.findById(productId);

		res.json({ success: true, product });
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: error.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		const { id, name, description, price, sizes, features, washCare, images } =
			req.body;

		const updatedProduct = await productModel.findByIdAndUpdate(
			id,
			{
				name,
				description,
				price: Number(price),
				sizes,
				features,
				washCare,
				image: images, // Updated Cloudinary URLs
			},
			{ new: true }
		);

		if (!updatedProduct) {
			return res.json({ success: false, message: "Product not found" });
		}

		res.json({
			success: true,
			message: "Product updated successfully",
			product: updatedProduct,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};


export { addProduct, listProduct, removeProduct, singleProduct ,updateProduct };
