import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
const Navbar = ({ setToken }) => {
	return (
		<div className=" flex items-center  px-[4%] justify-between bg-[#eeeefb]">
			<Link
				to="/"
				className="transform transition-transform hover:scale-105 duration-300"
			>
				<img
					src={assets.logo}
					alt="blooming"
					className="sm:pl-4 w-56 lg:w-72 sm:h-18 
					hover:drop-shadow-lg transition-all duration-300 sm:pb-5"
				/>
			</Link>
			<button
				onClick={() => setToken("")}
				className="bg-gray-600 text-white px-4 py-1 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm mr-10"
			>
				Logout
			</button>
		</div>
	);
};

export default Navbar;
