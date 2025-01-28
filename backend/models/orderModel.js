import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: { type:String, ref: "user", required: true },
		items : {type : Array , required : true},
		mobileNumber: { type: String, required: true },
		address: { type: Object, required: true },
		paymentMode: { type: String, enum: ["UPI", "Card", "COD"], required: true },
		payment : {type:Boolean , required : true},
		status: { type: String, required : true , default:'Order Placed'},
		date: { type: Number,required:true},
	}
);

const orderModel =
	mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
