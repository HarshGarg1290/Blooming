import express from "express";
import cors from "cors";
import "dotenv/config";

import connectdb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";
import contactRouter from "./routes/contactRoute.js";


const app = express();

const port = process.env.PORT || 4000;

connectdb();
connectCloudinary();

app.use(express.json());

const allowedOrigins = [
	"https://blooming-frontend.vercel.app",
	"https://blooming-admin-phi.vercel.app",
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("CORS policy does not allow this origin"));
			}
		},
		methods: "GET,POST,PUT,DELETE,OPTIONS",
		credentials: true, // Allow cookies & authentication headers
	})
);
app.options("*", cors()); 




app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/order", orderRouter);

app.use("/api/cart", cartRouter);

app.use('/api/contact', contactRouter);


app.get("/", (req, res) => {
	res.send("API WORKING");
});

app.listen(port, () => {
	console.log("server started on port:" + port);
});
