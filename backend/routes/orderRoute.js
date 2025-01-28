import express from "express";
import {
	placeOrder,
	placeOrderRazorPay,
	userOrders,
	allOrders,
	updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
