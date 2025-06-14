import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

// 🚀 OPTIMIZATION: Import AOS dynamically
let AOS;

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [sortedProducts, setSortedProducts] = useState(products);
    const [sortOption, setSortOption] = useState("default");

    // 🚀 OPTIMIZATION: Initialize AOS only once and dynamically
    useEffect(() => {
        const initAOS = async () => {
            if (!AOS) {
                const AOSModule = await import("aos");
                AOS = AOSModule.default;
                await import("aos/dist/aos.css");
                AOS.init({
                    duration: 600,
                    once: true, // 🚀 Animation only happens once
                    offset: 100
                });
            }
        };
        
        if (products.length > 0) {
            initAOS();
        }
    }, []);

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
        <div className="flex flex-col gap-1 sm:gap-10 pt-10 sm:pt-20 border-t mb-[100px] sm:mb-[200px]">
            <div className="flex">
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
                            data-aos-delay={Math.min(index * 100, 1000)} // 🚀 Cap delay to prevent too long delays
                            className="border-2 border-[#3c3b3c] border-opacity-10"
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
