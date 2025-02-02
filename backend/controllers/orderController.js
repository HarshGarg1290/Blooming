import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
	try {
		const { userId, items, amount, user_details, phone } = req.body;

		const orderData = {
			userId,
			items,
			amount,
			phone,
			user_details,
			paymentMode: "COD",
			payment: false,
			date: Date.now(),
		};

		const newOrder = new orderModel(orderData);

		await newOrder.save();

		await userModel.findByIdAndUpdate(userId, { cartData: {} });

		res.json({ success: true, message: "Order Placed Successfully" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const placeOrderRazorPay = async (req, res) => {};

const allOrders = async (req, res) => {
	try {
		const orders = await orderModel.find({});
		res.json({ success: true, orders });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const userOrders = async (req, res) => {
	try {
		const { userId } = req.body;
		const orders = await orderModel.find({ userId });
		res.json({ success: true, orders });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const updateStatus = async (req, res) => {
	try {
		const { orderId, status } = req.body;
		await orderModel.findByIdAndUpdate(orderId, { status });
		res.json({ success: true, message: "Status Updated" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export { placeOrder, placeOrderRazorPay, userOrders, allOrders, updateStatus };
