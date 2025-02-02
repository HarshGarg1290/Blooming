import { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
const PlaceOrder = () => {
	const {
		products,
		currency,
		cartItems,
		navigate,
		backendUrl,
		token,
		setCartItems,
	} = useContext(ShopContext);
	const [cartData, setCartData] = useState([]);
	const [method, setMethod] = useState("cod");

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		address: "",
		apartment: "",
		city: "",
		state: "",
		zip: "",
		phone: "",
	});

	const onChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const shippingFee = 50.0;

	const initPay = (order) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			name: "Order Payment",
			desciption: "Order Payment",
			order_id: order.id,
			receipt: order.receipt,
			handler: async (res) => {
			
				try {
					const { data } = await axios.post(
						backendUrl + "/api/order/verifyRazorpay",
						res,
						{ headers: { token } }
					);
					if (data.success) {
						navigate("/orders");
						setCartItems({});
					}
				} catch (error) {
					console.log(error);
					toast.error(error);
				}
			},
		};

		const rzp = new window.Razorpay(options);
		rzp.open();
	};
	useEffect(() => {
		const temp = [];
		for (const items in cartItems) {
			for (const item in cartItems[items]) {
				if (cartItems[items][item] > 0) {
					temp.push({
						_id: items,
						size: item,
						quantity: cartItems[items][item],
					});
				}
			}
		}
		setCartData(temp);
	}, [cartItems]);

	const total = useMemo(() => {
		return cartData
			.reduce((total, item) => {
				const productData = products.find(
					(product) => product._id === item._id
				);
				return total + (productData?.price || 0) * item.quantity;
			}, 0)
			.toFixed(2);
	}, [cartData, products]);

	const grandTotal = useMemo(
		() => (parseFloat(total) + shippingFee).toFixed(2),
		[total, shippingFee]
	);

	const handlePlaceOrder = async (e) => {
		e.preventDefault();
		try {
			let orderItems = [];
			for (const items in cartItems) {
				for (const item in cartItems[items]) {
					if (cartItems[items][item] > 0) {
						const itemInfo = structuredClone(
							products.find((product) => product._id === items)
						);
						if (itemInfo) {
							itemInfo.size = item;
							itemInfo.quantity = cartItems[items][item];
							orderItems.push(itemInfo);
						}
					}
				}
			}

			let orderData = {
				user_details: formData,
				items: orderItems,
				amount: grandTotal,
				phone: formData.phone,
			};

			switch (method) {
				case "cod": {
					const response = await axios.post(
						backendUrl + "/api/order/place",
						orderData,
						{ headers: { token } }
					);
					if (response.data.success) {
						setCartItems({});
						navigate("/orders");
					} else {
						toast.error(response.data.message);
					}
					break;
				}

				case "razorpay": {
					const responseRazorpay = await axios.post(
						backendUrl + "/api/order/razorpay",
						orderData,
						{ headers: { token } }
					);
					if (responseRazorpay.data.success) {
						initPay(responseRazorpay.data.order);
					}
					break;
				}
				default:
					break;
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	return (
		<form
			onSubmit={handlePlaceOrder}
			className="flex flex-col justify-between sm:flex-row  pt-24 sm:pt-14 min-h-[80vh] border-t"
		>
			{/* Right side: Cart Summary (This should come first on mobile) */}
			<div className="flex flex-col w-full sm:max-w-[480px] bg-gray-100 p-6 rounded-lg sm:order-2">
				<div className="font-hubot text-2xl mb-4 font-semibold text-gray-800">
					Cart Summary
				</div>

				{/* Cart Items */}
				{cartData.length === 0 ? (
					<div className="text-center text-gray-500">Your cart is empty</div>
				) : (
					<div className="flex flex-col gap-4">
						{cartData.map((item, index) => {
							const productData = products.find(
								(product) => product._id === item._id
							);
							if (!productData) return null;
							return (
								<div key={index} className="flex justify-between">
									<div className="flex text-sm text-gray-700">
										<img
											className="w-10 h-15 object-cover rounded"
											src={productData.image[0]}
											alt={productData.name}
										/>
										{productData.name} - {item.size}
									</div>
									<div className="font-medium text-gray-900">
										{currency}
										{(productData.price * item.quantity).toFixed(2)}
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Total and Shipping Fee */}
				<div className="mt-6 border-t pt-4">
					<div className="flex justify-between text-gray-700">
						<span>Total:</span>
						<span className="font-bold">
							{currency}
							{total}
						</span>
					</div>
					<div className="flex justify-between text-gray-700 mt-2">
						<span>Shipping Fee:</span>
						<span className="font-bold">
							{currency}
							{shippingFee.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between text-gray-900 font-semibold mt-4">
						<span>Grand Total:</span>
						<span>
							{currency}
							{grandTotal}
						</span>
					</div>
				</div>
			</div>

			{/* Left side: Delivery Information */}
			<div className="flex flex-col gap-4 w-full sm:max-w-[480px] sm:order-1">
				<div className="flex items-center gap-2 font-hubot font-semibold text-lg sm:text-3xl my-3">
					<Title text1={"DELIVERY  "} text2={"INFORMATION "} />
					<span className="hidden sm:block w-8 sm:w-12 sm:h-[3px] bg-[#000000] "></span>
				</div>
				{/* Form Fields */}
				<div className="flex gap-3">
					<input
						onChange={onChangeHandler}
						name="firstName"
						value={formData.firstName}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="text"
						placeholder="First Name"
						aria-label="First Name"
						required
					/>
					<input
						onChange={onChangeHandler}
						name="lastName"
						value={formData.lastName}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="text"
						placeholder="Last Name"
						aria-label="Last Name"
						required
					/>
				</div>

				<input
					onChange={onChangeHandler}
					name="email"
					value={formData.email}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					type="email"
					placeholder="Email Address"
					aria-label="Email Address"
					required
				/>
				<input
					onChange={onChangeHandler}
					name="address"
					value={formData.address}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					type="text"
					placeholder="Address"
					aria-label="Address"
					required
				/>
				<input
					onChange={onChangeHandler}
					name="apartment"
					value={formData.apartment}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					type="text"
					placeholder="Apartment, Suite, etc (optional)"
					aria-label="Apartment, Suite, etc"
				/>
				<div className="flex gap-3">
					<input
						onChange={onChangeHandler}
						name="city"
						value={formData.city}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="text"
						placeholder="City"
						aria-label="City"
						required
					/>
					<select
						name="state"
						value={formData.state}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full text-gray-400"
						onChange={(e) => {
							onChangeHandler(e);
							e.target.classList.toggle("text-black", e.target.value !== "");
							e.target.classList.toggle("text-gray-400", e.target.value === "");
						}}
						aria-label="State"
						required
					>
						<option value="" disabled hidden>
							Select State
						</option>
						{/* States */}
						<option value="Andhra Pradesh">Andhra Pradesh</option>
						<option value="Arunachal Pradesh">Arunachal Pradesh</option>
						<option value="Assam">Assam</option>
						<option value="Bihar">Bihar</option>
						<option value="Chhattisgarh">Chhattisgarh</option>
						<option value="Goa">Goa</option>
						<option value="Gujarat">Gujarat</option>
						<option value="Haryana">Haryana</option>
						<option value="Himachal Pradesh">Himachal Pradesh</option>
						<option value="Jharkhand">Jharkhand</option>
						<option value="Karnataka">Karnataka</option>
						<option value="Kerala">Kerala</option>
						<option value="Ladakh">Ladakh</option>
						<option value="Lakshadweep">Lakshadweep</option>
						<option value="Madhya Pradesh">Madhya Pradesh</option>
						<option value="Maharashtra">Maharashtra</option>
						<option value="Manipur">Manipur</option>
						<option value="Meghalaya">Meghalaya</option>
						<option value="Mizoram">Mizoram</option>
						<option value="Nagaland">Nagaland</option>
						<option value="Odisha">Odisha</option>
						<option value="Puducherry">Puducherry</option>
						<option value="Punjab">Punjab</option>
						<option value="Rajasthan">Rajasthan</option>
						<option value="Sikkim">Sikkim</option>
						<option value="Tamil Nadu">Tamil Nadu</option>
						<option value="Telangana">Telangana</option>
						<option value="Tripura">Tripura</option>
						<option value="Uttar Pradesh">Uttar Pradesh</option>
						<option value="Uttarakhand">Uttarakhand</option>
						<option value="West Bengal">West Bengal</option>
					</select>

					<input
						onChange={onChangeHandler}
						name="zip"
						value={formData.zip}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="number"
						placeholder="Pin Code"
						aria-label="Pin Code"
						required
					/>
				</div>
				<input
					onChange={onChangeHandler}
					name="phone"
					value={formData.phone}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					type="number"
					placeholder="Phone Number"
					aria-label="Phone Number"
					required
				/>

				{/* Payment Methods */}
				<div className="mt-7">
					<div className="text-xl font-semibold">
						<Title text1={"CHOOSE "} text2={"PAYMENT"} />
					</div>
					<div className="flex flex-col gap-3 mt-4">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="paymentMethod"
								value="upi"
								checked={method === "razorpay"}
								onChange={() => setMethod("razorpay")}
							/>
							<span>RazorPay</span>
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="paymentMethod"
								value="cod"
								checked={method === "cod"}
								onChange={() => setMethod("cod")}
							/>
							<span>Cash on Delivery</span>
						</label>
					</div>
				</div>

				{/* Place Order Button */}
				<button
					type="submit"
					disabled={cartData.length === 0}
					className={`bg-black text-white py-2 px-4 rounded mt-8 font-semibold ${
						cartData.length === 0
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-800"
					}`}
				>
					Place Order
				</button>
			</div>
		</form>
	);
};

export default PlaceOrder;
