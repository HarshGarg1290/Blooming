import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
	const [orders, setOrders] = useState([]);

	const fetchAllOrders = async () => {
		if (!token) return null;

		try {
			const response = await axios.post(
				backendUrl + "/api/order/list",
				{},
				{ headers: { token } }
			);
			if (response.data.success) {
				setOrders(response.data.orders);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	const statusHandler = async (e, orderId) => {
		try {
			const response = await axios.post(
				backendUrl + "/api/order/status",
				{
					orderId,
					status: e.target.value,
				},
				{ headers: { token } }
			);
			if (response.data.success) {
				await fetchAllOrders();
			}
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	useEffect(() => {
		fetchAllOrders();
	}, [token]);

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<h3 className="text-2xl font-bold mb-6 text-gray-800">ORDERS</h3>

			<div className="space-y-6">
				{orders.map((order, index) => (
					<div
						key={index}
						className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 items-start"
					>
						<img
							src={assets.parcel_icon}
							alt=""
							className="w-16 h-16 object-contain"
						/>

						<div className="flex-grow space-y-4">
							<div className="space-y-1">
								{order.items.map((item, index) => (
									<p key={index} className="text-gray-700">
										{item.name} x {item.quantity}
										<span className="ml-2 text-sm text-gray-500">
											{item.size}
										</span>
										{index !== order.items.length - 1 && ","}
									</p>
								))}
							</div>

							<p className="font-semibold text-gray-800">
								{order.user_details.firstName +
									" " +
									order.user_details.lastName}
							</p>

							<div className="text-gray-600 text-sm">
								<p>
									{order.user_details.apartment +
										", " +
										order.user_details.address +
										","}
								</p>
								<p>
									{order.user_details.city +
										", " +
										order.user_details.state +
										", " +
										order.user_details.zip}
								</p>
							</div>

							<p className="text-gray-600">{order.user_details.phone}</p>
						</div>

						<div className="space-y-2 text-sm text-gray-600">
							<p>Items: {order.items.length}</p>
							<p>Method: {order.paymentMode}</p>
							<p>Payment: {order.payment ? "Done" : "Pending"}</p>
							<p>Date: {new Date(order.date).toLocaleDateString()}</p>
						</div>

						<div className="text-right">
							<p className="text-xl font-bold text-gray-800 mb-4">
								{currency} {order.amount}
							</p>

							<select
								onChange={(event) => statusHandler(event, order._id)}
								value={order.status}
								className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="Order Placed">Order Placed</option>
								<option value="Packing">Packing</option>
								<option value="Shipped">Shipped</option>
								<option value="Out for Delivery">Out for Delivery</option>
								<option value="Delivered">Delivered</option>
							</select>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Orders;
