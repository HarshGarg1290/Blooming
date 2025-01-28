import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import AOS from "aos";
import "aos/dist/aos.css"; 

const Collection = () => {
	const { products , search , showSearch } = useContext(ShopContext);
	const [sortedProducts, setSortedProducts] = useState(products);
	const [sortOption, setSortOption] = useState("default");

	useEffect(() => {
		AOS.init();
	}, [products]);

	useEffect(() => {
		let newSortedProducts = [...products];

		switch (sortOption) {
			case "low-high":
				newSortedProducts.sort((a, b) => a.price - b.price);
				break;
			case "high-low":
				newSortedProducts.sort((a, b) => b.price - a.price);
				break;
			default:
				break;
		}

		if (showSearch && search) {
			newSortedProducts = newSortedProducts.filter((item) =>
				item.name.toLowerCase().includes(search.toLowerCase())
			);
		}

		setSortedProducts(newSortedProducts);
	}, [products, sortOption, showSearch, search]);

	const handleSortChange = (e) => {
		setSortOption(e.target.value);
	};

 
	return (
		<div className="flex flex-col gap-1 sm:gap-10 pt-20 border-t mb-[100px] sm:mb-[200px] ">
			<div className="flex ">
				<div className="w-full flex justify-between items-center gap-4 font-hubot text-xl sm:text-3xl mb-4">
					<div className="flex items-center gap-2 sm:gap-4 font-semibold">
						<Title text1="ALL " text2="COLLECTIONS" />
						<span className="hidden sm:block w-8 sm:w-12 sm:h-[3px] bg-[#000000] mt-[-8px]"></span>
					</div>
					<select
						className="border-2 border-gray-300 text-xs px-2 py-3"
						value={sortOption}
						onChange={handleSortChange}
					>
						<option value="low-high">Sort by: Low to High</option>
						<option value="high-low">Sort by: High to Low</option>
					</select>
				</div>
			</div>

			<div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 gap-y-3">
					{sortedProducts.map((item, index) => (
						<div
							key={item._id}
							data-aos="zoom-in-up"
							data-aos-duration="600"
							data-aos-delay={index * 100}
							className="border-2  border-[#86589d] border-opacity-25"
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
		</div>
	);
};

export default Collection;
