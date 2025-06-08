import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		cartData: { type: Object, default: {} },
		deliveryDetails: {
			firstName: { type: String, default: "" },
			lastName: { type: String, default: "" },
			email: { type: String, default: "" },
			address: { type: String, default: "" },
			apartment: { type: String, default: "" },
			city: { type: String, default: "" },
			state: { type: String, default: "" },
			zip: { type: String, default: "" },
			phone: { type: String, default: "" },
		},
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
	},
	{ minimize: false }
);


const userModel = mongoose.models.user || mongoose.model("user", userSchema);



export default userModel;
