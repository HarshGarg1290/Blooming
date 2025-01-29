import { ShopContext } from "./ShopContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import Cart from "../pages/Cart";
import { useNavigate } from "react-router-dom";

const ShopContextProvider = (props) => {
	const currency = "₹";
	const delivery_fee = 10;
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [search, setSearch] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [products, setProducts] = useState([]);
	const [token, setToken] = useState("");
	const navigate = useNavigate();

	const fetchReviews = async (productId) => {
		try {
			const response = await fetch(`/api/reviews/${productId}`);
			const data = await response.json();
			setReviews(data);
		} catch (error) {
			console.error("Error fetching reviews:", error);
		}
	};

	// Add a review to the backend and update the local state
	const addReview = async (newReview) => {
		try {
			const response = await fetch("/api/reviews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newReview),
			});
			if (response.ok) {
				setReviews((prevReviews) => [...prevReviews, newReview]);
				toast.success("Review submitted successfully!");
			} else {
				toast.error("Failed to submit review.");
			}
		} catch (error) {
			console.error("Error adding review:", error);
			toast.error("Error adding review.");
		}
	};

	const addToCart = async (itemId, size) => {
		if (!size) {
			toast("Select Product Size !!", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "colored",
				transition: Bounce,
				className: `
					bg-purple-400 
					text-white 
					font-semibold 
					rounded-lg 
					shadow-xl 
					border 
					border-purple-400 
					p-4 
					text-sm 
					transform 
					hover:scale-105 
					transition-all 
					duration-300 
					ease-in-out
				`,
				progressClassName: `
					bg-purple-400
					h-[2px]
				`,
			});

			return;
		}

		let cartData = structuredClone(cartItems);

		if (cartData[itemId]) {
			if (cartData[itemId][size]) {
				cartData[itemId][size] += 1;
			} else {
				cartData[itemId][size] = 1;
			}
		} else {
			cartData[itemId] = {};

			cartData[itemId][size] = 1;
		}

		setCartItems(cartData);
		if (token) {
			try {
				await axios.post(
					backendUrl + "/api/cart/add",
					{ itemId, size },
					{ headers: {token } }
				);
			} catch (error) {
				console.log(error);
				toast.error(error.message);
			}
		}
		setIsCartOpen(true);

		
	};

	const [isCartOpen, setIsCartOpen] = useState(false);

	const toggleCart = () => {
		setIsCartOpen(!isCartOpen);
	};

	const updateCartQuantity = async (itemId, size, newQuantity) => {
		let cartData = structuredClone(cartItems);

		if (newQuantity === 0) {
			delete cartData[itemId][size];
			if (Object.keys(cartData[itemId]).length === 0) {
				delete cartData[itemId];
			}
		} else {
			cartData[itemId][size] = newQuantity; // Update quantity
		}

		setCartItems(cartData);

		if (token) {
			try {
			await axios.post(
				backendUrl + "/api/cart/update",
				{ itemId, size, quantity: newQuantity },
				{ headers: { token } }
			);
			} catch (error) {
				console.log(error);
				toast.error(error.message);
			}
		}
	};

	const getCartCount = () => {
		let totalCount = 0;
		for (const items in cartItems) {
			for (const item in cartItems[items]) {
				try {
					if (cartItems[items][item] > 0) {
						totalCount += cartItems[items][item];
					}
				} catch (error) {
					console.log(error);
				}
			}
		}

		return totalCount;
	};

	const getCartAmount = () => {
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


	const getProductsData = async () => {
		try {
			const response = await axios.get(backendUrl + "/api/product/list");

			if (response.data.success) {
				setProducts(response.data.products);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const getUserCart = async (token) => {
		try {
			const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
			if (response.data.success) {
				setCartItems(response.data.cartData)
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	}

	useEffect(() => {
		getProductsData();
	}, []);

	useEffect(() => {
		if (!token && localStorage.getItem("token")) {
			setToken(localStorage.getItem("token"));
			getUserCart(localStorage.getItem("token"));
		}
	}, []);

	const value = {
		products,
		currency,
		delivery_fee,
		search,
		setSearch,
		showSearch,
		setShowSearch,
		setCartItems,
		reviews,
		addReview,
		cartItems,
		addToCart,
		getCartCount,
		isCartOpen,
		toggleCart,
		updateCartQuantity,
		navigate,
		backendUrl,
		token,
		setToken,
		getCartAmount,
	};

	return (
		<ShopContext.Provider value={value}>
			{props.children}{" "}
			{isCartOpen && <Cart isOpen={isCartOpen} onClose={() => toggleCart()} />}
		</ShopContext.Provider>
	);
};

export default ShopContextProvider;
