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
		setIsCartOpen(true);
	};

	const [isCartOpen, setIsCartOpen] = useState(false);

	const toggleCart = () => {
		setIsCartOpen(!isCartOpen);
	};

	const updateCartQuantity = (itemId, size, newQuantity) => {
		let cartData = structuredClone(cartItems);

		if (newQuantity === 0) {
			delete cartData[itemId][size]; // Remove the item if quantity is 0
			if (Object.keys(cartData[itemId]).length === 0) {
				delete cartData[itemId]; // Remove the product entirely if no sizes left
			}
		} else {
			cartData[itemId][size] = newQuantity; // Update quantity
		}

		setCartItems(cartData);
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

	useEffect(() => {
		getProductsData();
	}, []);

	useEffect(() => {
		if (!token && localStorage.getItem("token")) {
			setToken(localStorage.getItem("token"));
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
	};

	return (
		<ShopContext.Provider value={value}>
			{props.children}{" "}
			{isCartOpen && <Cart isOpen={isCartOpen} onClose={() => toggleCart()} />}
		</ShopContext.Provider>
	);
};

export default ShopContextProvider;
