import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.name);
    setBestSeller(bestProduct.slice(0, 4));
    AOS.init();
  }, [products]);

  return (
		<section className="my-16 px-4">
			{/* Title Section */}
			<div
				className="text-center text-3xl"
				data-aos="fade-in"
				data-aos-duration="600"
			>
				<Title text1="BEST" text2="SELLERS" />
				<div className="flex items-center justify-center w-full max-w-md mx-auto text-gray-600 mt-4">
					<span
						data-aos="fade-right"
						data-aos-delay="100"
						className="w-10 sm:w-14 h-[1px] bg-black"
					></span>
					<span
						data-aos="fade-up"
						data-aos-delay="400"
						className="mx-3 text-sm sm:text-base font-medium text-black"
					>
						Top Picks, Trending Now!
					</span>
					<span
						data-aos="fade-left"
						data-aos-delay="400"
						className="w-10 sm:w-14 h-[1px] bg-black"
					></span>
				</div>
			</div>

			{/* Product Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-12">
				{bestSeller.map((item, index) => (
					<div
						key={item._id}
						data-aos="zoom-in-up"
						data-aos-duration="600"
						data-aos-delay={index * 150}
						className="bg-white shadow-lg  overflow-hidden transform transition-all duration-300 hover:scale-105"
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
		</section>
	);
};

export default BestSeller;
