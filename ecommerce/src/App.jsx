import { Routes, Route } from "react-router-dom";
import { useContext } from "react"; // Add this import
import { ShopContext } from "./context/ShopContext"; // Add this import
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart"; // This will now be your sidebar

import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Search from "./components/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
	const { isCartOpen, toggleCart } = useContext(ShopContext);

	return (
		<div className="relative">
			<ScrollToTop/>
			<ToastContainer />
			<Navbar />

			<div className="px-4 sm:px-[5vw] md:px-[7vw] lg-px-[9vw]">
				.
				<div className="mt-12 sm:mt-[88px]">
					<Search />
				</div>
				{isCartOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-50"
						onClick={toggleCart}
					/>
				)}
				<Cart isOpen={isCartOpen} onClose={toggleCart} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/collection" element={<Collection />} />

					<Route path="/contact" element={<Contact />} />
					<Route path="/product/:productId" element={<Product />} />
					<Route path="/login" element={<Login />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/place-order" element={<PlaceOrder />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
};

export default App;
