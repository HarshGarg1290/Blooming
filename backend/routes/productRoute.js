import express from "express";
import {
	listProduct,
	addProduct,
	removeProduct,
	singleProduct,
	// addReview,
	// getReviews,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Product routes
productRouter.post(
	"/add",adminAuth,
	upload.fields([
		{ name: "image1", maxCount: 1 },
		{ name: "image2", maxCount: 1 },
		{ name: "image3", maxCount: 1 },
		{ name: "image4", maxCount: 1 },
	]),
	addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);

// // Review routes
// productRouter.post("/review/add", addReview); // Add review
// productRouter.get("/reviews/:productId", getReviews); // Get reviews of a product

export default productRouter;
