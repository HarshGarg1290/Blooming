import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Orders = () => {
	const { backendUrl, token, currency } = useContext(ShopContext);
	const [orderData, setOrderData] = useState([]);

	const loadOrderData = async () => {
		try {
			if (!token) return null;

			const response = await axios.post(
				backendUrl + "/api/order/userorders",
				{},
				{ headers: { token } }
			);

			if (response.data.success) {
				let allOrderItem = [];
				response.data.orders.forEach((order) => {
					order.items.forEach((item) => {
						item["status"] = order.status;
						item["payment"] = order.payment;
						item["paymentMode"] = order.paymentMode;
						item["date"] = order.date;
						allOrderItem.push(item);
					});
				});
				setOrderData(allOrderItem.reverse());
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		loadOrderData();
	}, [token]);

	const getStatusColor = (status) => {
		const statusColors = {
			"Order Placed": "bg-yellow-500",
			"Out for Delivery": "bg-purple-500",
			"Order Delivered": "bg-green-500",
			Cancelled: "bg-red-500",
		};
		return statusColors[status] || "bg-gray-500";
	};

	return (
		<div className="container mx-auto px-4 pt-8 sm:pt-24 pb-12">
			<div className="mb-8">
				<h1 className="text-3xl sm:text-4xl font-bold">My Orders</h1>
				<p className="text-sm sm:text-base text-gray-500 mt-2">
					Track and manage your orders
				</p>
			</div>

			<div className="space-y-3">
				{orderData.map((item, index) => (
					<div
						key={index}
						className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
					>
						<div className=" p-4">
							<div className="flex flex-col md:flex-row gap-6">
								{/* Product Image */}
								<div className="relative w-full md:w-48 h-48 md:h-auto flex items-center justify-center">
									<img
										src={item.image[0]}
										alt={item.name}
										className=" h-full object-cover rounded-lg"
									/>
								</div>

								{/* Product Details */}
								<div className="flex-1 space-y-4">
									<div>
										<h2 className="text-xl sm:text-2xl font-semibold">
											{item.name}
										</h2>
										<div className="mt-2 flex flex-wrap gap-4">
											<span className="px-3 py-1 bg-gray-100 rounded-full text-sm sm:text-base font-medium">
												{currency}
												{item.price}
											</span>
											<span className="text-sm sm:text-base text-gray-600">
												Quantity: {item.quantity}
											</span>
											<span className="text-sm sm:text-base text-gray-600">
												Size: {item.size}
											</span>
										</div>
									</div>

									<div className="border-t border-gray-200 my-4"></div>

									{/* Order Details */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="flex items-center gap-2">
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Order Date
												</p>
												<p className="font-medium text-sm sm:text-base">
													{new Date(item.date).toDateString()}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2">
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Payment Method
												</p>
												<p className="font-medium text-sm sm:text-base">
													{item.paymentMode}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2">
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Status
												</p>
												<span
													className={`px-3 py-1 rounded-full text-white text-xs sm:text-sm ${getStatusColor(
														item.status
													)}`}
												>
													{item.status}
												</span>
											</div>
										</div>
									</div>

									{/* Track Order Button */}
									<div className="pt-4">
										<button
											onClick={loadOrderData}
											className="w-full md:w-auto px-6 py-2 bg-[#b07afc] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
										>
											Track Order
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Orders;
