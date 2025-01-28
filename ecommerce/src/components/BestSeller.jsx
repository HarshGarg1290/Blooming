import  { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
	const { products } = useContext(ShopContext);
	const [bestSeller, setbestSeller] = useState([]);

	useEffect(() => {
		const bestProduct = products.filter((item) => item.name);
		setbestSeller(bestProduct.slice(0, 4));
		AOS.init();
	}, [products]);

	return (
		<div className="my-10 sm:mt-[100px]">
			{/* Title Section */}
			<div
				className="font-hubot text-center py-8 text-3xl"
				data-aos="fade-in"
				data-aos-duration="600"
			>
				<Title text1="BEST" text2="SELLERS" />
				<div className="flex flex-row items-center justify-center w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
					<span
						data-aos="fade-right"
						data-aos-delay="100"
						className="w-8 sm:w-12 h-[0.5px] sm:h-[1px] bg-[#000000]"
					></span>
					<span
						data-aos="fade-up"
						data-aos-delay="400"
						className="mx-2 text-[#000000]"
					>
						Top Picks, Trending Now!
					</span>
					<span
						data-aos="fade-left"
						data-aos-delay="400"
						className="w-8 sm:w-12 h-[0.5px] sm:h-[1px] bg-[#000000]"
					></span>
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6  mt-10">
				{bestSeller.map((item, index) => (
					<div
						key={item._id}
						data-aos="zoom-in-up"
						data-aos-duration="600"
						data-aos-delay={index * 100}
						
					>
						<ProductItem
							id={item._id}
							image={item.image}
							name={item.name}
							price={item.price}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default BestSeller;
