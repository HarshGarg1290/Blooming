import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
		mobileNumber: { type: String, required: true },
		address: { type: String, required: true },
		paymentMode: { type: String, enum: ["UPI", "Card", "COD"], required: true },
		status: { type: String, default: "Pending" },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const orderModel =
	mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
