import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";

const currency = "INR";
const deliveryCharge = 50;

const razorpayInstance = new razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

const placeOrderRazorPay = async (req, res) => {
	try {
		const { userId, items, amount, user_details, phone } = req.body;

		const orderData = {
			userId,
			items,
			amount,
			phone,
			user_details,
			paymentMode: "RazorPay",
			payment: false,
			date: Date.now(),
		};
		const newOrder = new orderModel(orderData);
		await newOrder.save();

		const options = {
			amount: amount * 100,
			currency: currency,
			receipt: newOrder._id.toString(),
		};

		await razorpayInstance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.json({ success: false, message: error });
			}

			res.json({ success: true, order });
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const verifyRazorPay = async (req, res) => {
	try {
		const { userId, razorpay_order_id } = req.body;
		const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
		console.log(orderInfo);

		if (orderInfo.status === "paid") {
			await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
			await userModel.findByIdAndUpdate(userId, { cartData: {} });
			res.json({ success: true, message: "Payment successful" });
		} else {
			res.json({ success: false, message: "Payment failed" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

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

export {
	placeOrder,
	placeOrderRazorPay,
	verifyRazorPay,
	userOrders,
	allOrders,
	updateStatus,
};
