import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Title from "../components/Title";

const Orders = () => {
	const { backendUrl, token, currency } = useContext(ShopContext);
	const [orderData, setOrderData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const statusColors = useMemo(
		() => ({
			"Order Placed": "bg-yellow-500",
			Shipped: "bg-blue-500",
			"Out for Delivery": "bg-purple-500",
			Delivered: "bg-green-500",
			Cancelled: "bg-red-500",
		}),
		[]
	);

	const getStatusColor = useCallback(
		(status) => {
			return statusColors[status] || "bg-gray-500";
		},
		[statusColors]
	);

	const loadOrderData = useCallback(
		async (isRefresh = false) => {
			if (!token) return;

			if (isRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}

			try {
				const response = await axios.post(
					`${backendUrl}/api/order/userorders`,
					{},
					{ headers: { token } }
				);

				if (response.data.success) {
					const allOrderItems = response.data.orders.flatMap((order) =>
						order.items.map((item) => ({
							...item,
							status: order.status,
							payment: order.payment,
							paymentMode: order.paymentMode,
							date: order.date,
							orderId: order._id,
						}))
					);

					allOrderItems.sort((a, b) => new Date(b.date) - new Date(a.date));
					setOrderData(allOrderItems);
				}
			} catch (error) {
				console.error("Error loading orders:", error);
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[backendUrl, token]
	);

	useEffect(() => {
		loadOrderData();
	}, [loadOrderData]);

	const handleRefresh = useCallback(() => {
		loadOrderData(true);
	}, [loadOrderData]);

	const formatPrice = useCallback((price, quantity) => {
		return (price * quantity).toFixed(2);
	}, []);

	if (loading) {
		return (
			<div className="container mx-auto px-4 pt-8 sm:pt-24 pb-12">
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-600">Loading your orders...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 pt-8 sm:pt-24 pb-12">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 sm:gap-4 font-semibold text-xl sm:text-3xl">
						<Title text1="YOUR " text2="ORDERS" />
						<span className="hidden sm:block w-8 sm:w-12 sm:h-[3px] bg-[#000000]"></span>
					</div>

					<button
						onClick={handleRefresh}
						disabled={refreshing}
						className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
							refreshing
								? "bg-gray-300 cursor-not-allowed"
								: "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
						}`}
					>
						{refreshing ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Refreshing...
							</div>
						) : (
							"Refresh"
						)}
					</button>
				</div>

				<p className="text-sm sm:text-base text-gray-500 mt-2">
					Track and manage your orders ({orderData.length} items)
				</p>
			</div>

			{orderData.length === 0 ? (
				<div className="text-center py-12">
					<div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<svg
							className="w-12 h-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-600 mb-2">
						No orders yet
					</h3>
					<p className="text-gray-500">
						Start shopping to see your orders here!
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{orderData.map((item, index) => (
						<div
							key={`${item.orderId}-${item._id}-${index}`}
							className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
						>
							<div className="p-4">
								<div className="flex flex-col md:flex-row gap-6">
									<div className="relative w-full md:w-48 h-48 md:h-auto flex items-center justify-center">
										<img
											src={item.image[0]}
											alt={item.name}
											className="h-full object-cover rounded-lg"
											loading="lazy"
											onError={(e) => {
												e.target.src = "/placeholder-product.jpg";
											}}
										/>
									</div>

									<div className="flex-1 space-y-4">
										<div>
											<h2 className="text-xl sm:text-2xl font-semibold">
												{item.name}
											</h2>
											<div className="mt-2 flex flex-wrap gap-4">
												<span className="px-3 py-1 bg-gray-100 rounded-full text-sm sm:text-base font-medium">
													{currency}
													{formatPrice(item.price, item.quantity)}
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

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="flex items-center gap-2">
												<div>
													<p className="text-xs sm:text-sm text-gray-500">
														Order Date
													</p>
													<p className="font-medium text-sm sm:text-base">
														{new Date(item.date).toLocaleDateString()}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<div>
													<p className="text-xs sm:text-sm text-gray-500">
														Payment Method
													</p>
													<p className="font-medium text-sm sm:text-base capitalize">
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

										<div className="pt-4">
											<button
												onClick={handleRefresh}
												disabled={refreshing}
												className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
													refreshing
														? "bg-gray-300 cursor-not-allowed"
														: "bg-[#b07afc] hover:bg-purple-700 text-white hover:scale-105"
												}`}
											>
												{refreshing ? "Updating..." : "Track Order"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Orders;
