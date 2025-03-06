import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
	const [visible, setVisible] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [userName, setUserName] = useState("");
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setScrolled(true); // Add animation classes when scrolled
			} else {
				setScrolled(false); // Reset animation classes
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const {
		setShowSearch,
		toggleCart,
		getCartCount,
		navigate,
		token,
		setToken,
		setCartItems,
		backendUrl,
	} = useContext(ShopContext);

	const fetchUserName = async () => {
		if (!token) return;
		try {
			const response = await axios.post(
				backendUrl + "/api/user/details",
				{ userId: localStorage.getItem("userId") },
				{ headers: { token } }
			);
			if (response.data.success) {
				setUserName(response.data.userName);
			} else {
				console.log("Error:", response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchUserName();
	}, [token]);

	const handleSearchClick = () => {
		navigate("/collection");
		setShowSearch(true);
	};

	const Logout = () => {
		navigate("/login");
		localStorage.removeItem("token");
		setToken("");
		setCartItems([]);
	};

	return (
		<div
			className={`fixed w-full font-hubot flex flex-row sm:flex-col items-center justify-between font-medium 
			bg-gradient-to-r from-violet-200 to-purple-100 
			py-4 px-4 sm:px-8 z-40 shadow-md 
			transition-all duration-500 ${
				scrolled ? "sm:translate-y-[-90px]" : "sm:translate-y-0"
			}`}
		>
			<Link
				to="/"
				className="transform transition-transform hover:scale-105 duration-300"
			>
				<img
					src={assets.logo2}
					alt="blooming"
					className="sm:pl-4 w-56 lg:w-72 sm:h-18 
					hover:drop-shadow-lg transition-all duration-300 sm:pb-5"
				/>
			</Link>
			<div className="w-full  flex  justify-end  sm:justify-between">
				{/* Profile Dropdown with Enhanced Interactions */}
				<div className="group relative  ">
					<div className="flex flex-row gap-4 mr-5 sm:mr-0">
						<img
							onClick={() => {
								token ? null : navigate("/login");
							}}
							src={assets.profile_icon}
							alt=""
							className="w-5 cursor-pointer 
								group-hover:-rotate-12
								transition-transform duration-300 "
						/>

						<p className="text-gray-800 font-semibold hidden sm:block w-[130px] truncate overflow-hidden whitespace-nowrap">
							Hey, {token ? userName : "User"}!
						</p>
					</div>

					{token && (
						<div className="group-hover:block hidden absolute dropdown-menu left-0 pt-4 z-20">
							<div
								className="
							flex flex-col gap-2 w-36 py-3 px-5 
							bg-purple-50 text-gray-600 
							rounded-lg shadow-lg 
							transform origin-top-right 
							transition-all duration-300 
							hover:scale-105"
							>
								{token && (
									<p className="text-gray-800 font-semibold block sm:hidden">
										{userName || "User"}
									</p>
								)}
								<p
									onClick={() => {
										navigate("/orders");
									}}
									className="
										cursor-pointer 
										hover:text-[#5c2674] 
										hover:translate-x-2 
										transition-all duration-300"
								>
									Orders
								</p>
								<p
									onClick={Logout}
									className="
										cursor-pointer 
										hover:text-[#5c2674] 
										hover:translate-x-2 
										transition-all duration-300"
								>
									Logout
								</p>
							</div>
						</div>
					)}
				</div>
				<ul className="hidden sm:flex gap-3 md:gap-5 text-[15px] text-black mr-24">
					<NavLink
						to="/"
						className="group flex flex-col items-center gap-1 relative"
					>
						<p
							className="group-hover:text-[#5c2674] 
							transform group-hover:scale-110 
							transition-all ease-in-out duration-300"
						>
							HOME
						</p>
						<hr
							className="absolute -bottom-1 hidden w-1/4  group-hover:w-3/4 
							border-none h-[2.5px] bg-[#5c2674] 
							transition-all duration-300"
						/>
					</NavLink>
					{["COLLECTION", "CONTACT"].map((item) => (
						<NavLink
							key={item}
							to={`/${item.toLowerCase()}`}
							className="group flex flex-col items-center gap-1 relative"
						>
							<p
								className="group-hover:text-[#5c2674] 
							transform group-hover:scale-110 
							transition-all ease-in-out duration-300"
							>
								{item}
							</p>
							<hr
								className="absolute -bottom-1 hidden w-1/4  group-hover:w-3/4 
							border-none h-[2.5px] bg-[#5c2674] 
							transition-all duration-300"
							/>
						</NavLink>
					))}
				</ul>

				<div className="flex items-center gap-4">
					{/* Search Icon with Pulse Effect */}
					<img
						onClick={handleSearchClick}
						src={assets.search_icon}
						className="w-5 cursor-pointer 
						hover:animate-pulse hover:text-[#5c2674] 
						transition-all duration-300"
						alt="Search"
					/>

					{/* Cart Icon with Bounce and Count */}
					<button onClick={toggleCart} className="relative group">
						<img
							src={assets.cart_icon}
							alt=""
							className="w-5 min-w-5 
							group-hover:animate-bounce 
							transition-transform duration-300"
						/>
						<p
							className="
						absolute right-[-5px] bottom-[-5px] 
						w-4 text-center leading-5 
						bg-[#421157] text-white 
						aspect-square rounded-full 
						text-[8px] 
						group-hover:scale-110 
						transition-transform"
						>
							{getCartCount()}
						</p>
					</button>

					{/* Mobile Menu Icon with Rotate Effect */}
					<img
						src={assets.menu_icon}
						alt=""
						className="w-5 cursor-pointer sm:hidden 
						hover:rotate-90 
						transition-transform duration-300"
						onClick={() => setVisible(true)}
					/>
				</div>
			</div>

			{/* Mobile Sidebar with Slide-in Animation */}
			<div
				className={`fixed top-0 right-0 bottom-0 left-0 
					bg-gradient-to-br from-purple-50 to-purple-100 
					overflow-hidden transition-all duration-500 ease-in-out z-50 
					${visible ? "translate-x-0" : "translate-x-full"}`}
			>
				<div className="flex flex-col text-gray-600 h-screen">
					<div
						onClick={() => setVisible(false)}
						className="flex items-center gap-4 p-3 cursor-pointer 
							hover:bg-purple-100 
							transition-colors duration-300"
					>
						<img
							src={assets.dropdown_icon}
							className="h-4 rotate-180 
								group-hover:scale-110 
								transition-transform"
						/>
						<p>BACK</p>
					</div>

					<NavLink
						onClick={() => setVisible(false)}
						to="/"
						className="py-2 pl-6 border 
								hover:bg-purple-100 
								hover:translate-x-4 
								transition-all duration-300"
					>
						HOME
					</NavLink>
					{["COLLECTION", "CONTACT"].map((item) => (
						<NavLink
							key={item}
							onClick={() => setVisible(false)}
							to={`/${item.toLowerCase()}`}
							className="py-2 pl-6 border 
								hover:bg-purple-100 
								hover:translate-x-4 
								transition-all duration-300"
						>
							{item}
						</NavLink>
					))}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
