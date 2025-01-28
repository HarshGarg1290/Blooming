import express from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const router = express.Router();


router.post("/", async (req, res) => {
	try {
		const { userId, mobileNumber, address, paymentMode } = req.body;

	
		if (!userId || !mobileNumber || !address || !paymentMode) {
			return res.status(400).json({ message: "All fields are required." });
		}

	
		const user = await userModel.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}


		const newOrder = new orderModel({
			user: userId,
			mobileNumber,
			address,
			paymentMode,
		});

		const savedOrder = await newOrder.save();

		res
			.status(201)
			.json({ message: "Order placed successfully.", order: savedOrder });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error." });
	}
});

// Fetch all orders for a user
router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		const orders = await orderModel
			.find({ user: userId })
			.sort({ createdAt: -1 });

		res.status(200).json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error." });
	}
});

export default router;
