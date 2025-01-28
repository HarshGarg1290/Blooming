import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		review: { type: String, required: true },
		images: { type: [String], default: [] },
		date: { type: Date, default: Date.now },
	},
	{ minimize: false }
);

// Define the product schema
const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		image: { type: [String], required: true },
		sizes: { type: [String], required: true },
		features: { type: [String], default: [] },
		washCare: { type: [String], default: [] },
		reviews: { type: [reviewSchema], default: [] },
		date: { type: Number, required: true },
	},
	{ minimize: false }
);

const productModel =
	mongoose.model.product || mongoose.model("product", productSchema);

export default productModel;
