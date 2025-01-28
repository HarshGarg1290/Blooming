import express from "express";
import cors from "cors";
import "dotenv/config";

import connectdb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";





const app = express();

const port = process.env.PORT || 4000;

connectdb();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/order", orderRouter);


app.get("/", (req, res) => {
	res.send("API WORKING");
});

app.listen(port, () => {
	console.log("server started on port:" + port);
});
