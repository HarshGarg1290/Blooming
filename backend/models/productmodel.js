import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		image: { type: [String], required: true },
		sizes: { type: [String], required: true },
		features: { type: [String], default: [] },
		washCare: { type: [String], default: [] },
	
		date: { type: Number, required: true },
	},
	{ minimize: false }
);

const productModel =
	mongoose.model.product || mongoose.model("product", productSchema);

export default productModel;
