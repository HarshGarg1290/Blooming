import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import useImagePreloader from "../hooks/useImagePreloader";

let AOS;

const BestSeller = () => {
	const { products } = useContext(ShopContext);
	const [bestSeller, setBestSeller] = useState([]);

	// 🚀 Preload bestseller images for instant loading
	const bestSellerImages = bestSeller
		.map((item) => item.image?.[0])
		.filter(Boolean);
	useImagePreloader(bestSellerImages);

	useEffect(() => {
		const initAOS = async () => {
			if (!AOS) {
				const AOSModule = await import("aos");
				AOS = AOSModule.default;
				await import("aos/dist/aos.css");
				AOS.init({
					duration: 600,
					once: true,
					offset: 100,
				});
			}
		};

		if (products.length > 0) {
			initAOS();
		}
	}, [products.length]);

	useEffect(() => {
		const bestProduct = products.filter((item) => item.name);
		const bestSellerItems = bestProduct.slice(0, 4);
		setBestSeller(bestSellerItems);

		// 🚀 PRELOAD BESTSELLER IMAGES for faster loading
		bestSellerItems.forEach((item) => {
			if (item.image && item.image[0]) {
				const img = new Image();
				img.src = item.image[0];
			}
		});
	}, [products]);

	return (
		<section className="mt-10 px-4">
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
				{bestSeller.map((item) => (
					<div
						key={item._id}
						data-aos="zoom-in-up"
						data-aos-duration="600"
						data-aos-delay={0}
						className="bg-white shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
					>
						<ProductItem
							id={item._id}
							image={item.image}
							name={item.name}
							price={item.price}
							eager={true}
						/>
					</div>
				))}
			</div>
		</section>
	);
};

export default BestSeller;
