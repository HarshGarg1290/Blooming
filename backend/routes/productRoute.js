import express from "express";
import {
	listProduct,
	addProduct,
	removeProduct,
	singleProduct,
	updateProduct,
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/update", adminAuth, updateProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);



export default productRouter;
