import { assets } from "../assets/assets";
const Navbar = ({ setToken }) => {
	return (
		<div className=" flex items-center  px-[4%] justify-between bg-[#eeeefb]">
			<img className="w-40 sm:w-80" src={assets.logo} alt="blooming" />
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
