import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { X } from "lucide-react";

const Cart = ({ isOpen, onClose }) => {
	const { products, currency, cartItems, updateCartQuantity, navigate ,token} =
		useContext(ShopContext);
	const [cartData, setCartData] = useState([]);

	useEffect(() => {

		if (products.length > 0) {
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
		}
	}, [cartItems,products]);

	const calculateTotal = () => {
		return cartData
			.reduce((total, item) => {
				const productData = products.find(
					(product) => product._id === item._id
				);

				if (!productData) {
					console.warn(`Product not found for item ID: ${item._id}`);
					return total; // Skip this item
				}

				return total + productData.price * item.quantity;
			}, 0)
			.toFixed(2);
	};


	const [ready, setReady] = useState(false);

	useEffect(() => {
		// Trigger smooth opening after initial render
		if (isOpen) {
			setTimeout(() => setReady(true), 10);
		} else {
			setReady(false);
		}
	}, [isOpen]);

	return (
		<div
			className={`fixed top-0 right-0 h-full w-[350px] sm:w-[400px] bg-white shadow-lg z-50 transform transition-all duration-500 ease-in-out 
				${
					isOpen
						? ready
							? "translate-x-0"
							: "translate-x-full"
						: "translate-x-full"
				} overflow-y-auto`}
		>
			{/* Header */}
			<div className="p-6 border-b flex justify-between items-center font-hubot text-2xl font-semibold">
				<Title text1={"YOUR "} text2={"BAG"} />
				<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
					<X size={24} />
				</button>
			</div>

			{/* Cart Content */}
			{cartData.length === 0 ? (
				<div className="text-center py-10 text-gray-500 font-hubot text-xl">
					Your cart is empty
				</div>
			) : (
				<>
					<div className="px-4">
						{cartData.map((item, index) => {
							const productData = products.find(
								(product) => product._id === item._id
							);
							return (
								<div
									key={index}
									className="py-4 border-b flex justify-between items-center"
								>
									{/* Product Image and Info */}
									<div className="flex items-center gap-4 font-raleway">
										<img
											className="w-20 h-28 object-cover rounded"
											src={productData.image[0]}
											alt={productData.name}
										/>
										<div>
											<p className="font-medium text-sm mb-1">
												{productData.name}
											</p>
											<p className="text-gray-500 text-sm">
												{currency}
												{productData.price}
											</p>
											<p className="text-gray-400 text-xs mt-1">
												Size: {item.size}
											</p>
										</div>
									</div>

									{/* Quantity and Remove */}
									<div className="flex flex-col items-end gap-2 font-raleway">
										<div className="flex items-center gap-2 border-2">
											<button
												className="px-2 py-0.5 text-xl"
												onClick={() =>
													updateCartQuantity(
														item._id,
														item.size,
														item.quantity - 1
													)
												}
											>
												-
											</button>
											<input
												className="w-8 text-center"
												type="text"
												min={1}
												value={item.quantity}
												onChange={(e) =>
													updateCartQuantity(
														item._id,
														item.size,
														parseInt(e.target.value, 10)
													)
												}
											/>
											<button
												className="px-2 mt-0.5 text-xl"
												onClick={() =>
													updateCartQuantity(
														item._id,
														item.size,
														item.quantity + 1
													)
												}
											>
												+
											</button>
										</div>
										<button
											className="text-red-500 text-sm hover:underline"
											onClick={() => updateCartQuantity(item._id, item.size, 0)}
										>
											Remove
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{/* Footer */}
					<div className="p-4 border-t">
						<div className="flex justify-between mb-4">
							<span className="font-medium text-gray-700">Total</span>
							<span className="font-bold text-gray-900">
								{currency}
								{calculateTotal()}
							</span>
						</div>
						<div className="flex items-center justify-center">
							<button
								onClick={() => {
										if (!token) {
											onClose();
										navigate("/login", {
											state: { redirectTo: "/place-order" },
										});
									} else {

										navigate("/place-order");
										onClose();
									}
								}}
								className="w-auto bg-[#E6E6FA] text-black py-2 px-3 rounded-full hover:bg-gray-800 transition hover:text-[#E6E6FA]"
							>
								CHECKOUT - {currency}
								{calculateTotal()}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Cart;
