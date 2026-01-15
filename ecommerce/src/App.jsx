import { Routes, Route } from "react-router-dom";
import { useContext, Suspense, lazy } from "react"; // Add Suspense, lazy
import { ShopContext } from "./context/ShopContext";

// 🚀 KEEP CRITICAL COMPONENTS EAGER (always needed)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Search from "./components/Search";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import LogoAnimation from "./pages/Loading";
import LogoLoader from "./components/LogoLoader";

// 🚀 LAZY LOAD PAGES (loaded on demand)
const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Login = lazy(() => import("./pages/Login"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Orders = lazy(() => import("./pages/Orders"));
const About = lazy(() => import("./pages/About"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

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
				<div className="mt-16 sm:mt-[117px]">
					<Search />
				</div>
				{isCartOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-50"
						onClick={toggleCart}
					/>
				)}
				<Cart isOpen={isCartOpen} onClose={toggleCart} />

				{/* 🚀 ADD SUSPENSE - KEEPS YOUR EXACT LAYOUT */}
				<Suspense fallback={<LogoLoader />}>
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
							path="/reset-password/:token"
							element={
								<PageWrapper>
									<ResetPassword />
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
				</Suspense>
			</div>
			<Footer />
		</div>
	);
};

export default App;
