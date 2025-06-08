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
import LogoAnimation from "./pages/Loading";
import About from "./pages/About";

const App = () => {
	const { isCartOpen, toggleCart } = useContext(ShopContext);
	const PageWrapper = ({ children }) => {
		return (
			<div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">{children}</div>
		);
	};

	return (
		<div className="relative">
			<LogoAnimation />
			<ScrollToTop />
			<ToastContainer />
			<Navbar />

			<div className="">
				.
				<div className="mt-12 sm:mt-[130px]">
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
					<Route
						path="/collection"
						element={
							<PageWrapper>
								<Collection />
							</PageWrapper>
						}
					/>
					<Route
						path="/contact"
						element={
							<PageWrapper>
								<Contact />
							</PageWrapper>
						}
					/>
					<Route
						path="/about"
						element={
							<PageWrapper>
								<About />
							</PageWrapper>
						}
					/>
					<Route
						path="/product/:productId"
						element={
							<PageWrapper>
								<Product />
							</PageWrapper>
						}
					/>
					<Route
						path="/login"
						element={
							<PageWrapper>
								<Login />
							</PageWrapper>
						}
					/>
					<Route
						path="/orders"
						element={
							<PageWrapper>
								<Orders />
							</PageWrapper>
						}
					/>
					<Route
						path="/place-order"
						element={
							<PageWrapper>
								<PlaceOrder />
							</PageWrapper>
						}
					/>
				</Routes>
			</div>
			<Footer />
		</div>
	);
};

export default App;
