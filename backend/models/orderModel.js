import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	items: { type: Array, required: true },
	phone: { type: String, required: true },
	user_details: { type: Object, required: true },

	paymentMode: { type: String, required: true },
	payment: { type: Boolean, required: true },
	amount: { type: String, required: true },
	status: { type: String, required: true, default: "Order Placed" },
	date: { type: Number, required: true },
});

const orderModel =
	mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
