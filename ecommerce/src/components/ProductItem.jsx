import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const ProductItem = ({ id, image, name, price, isBestSeller = false }) => {
	const { currency } = useContext(ShopContext);
	return (
		<Link className="text-gray-700 cursor-pointer block" to={`/product/${id}`}>
			<div className="space-y-2">
				<div className="overflow-hidden">
					<OptimizedImage
						src={image[0]}
						alt={name}
						className="w-full object-cover object-center hover:scale-200 transition ease-in-out duration-700 p-4"
						style={{ objectPosition: "center top" }}
						isCritical={isBestSeller}
					/>
				</div>
				<div className="text-center font-hubot">
					<p className="text-sm sm:text-base italic">{name}</p>
					<p className="text-sm font-medium">
						{currency}
						{price}
					</p>
				</div>
			</div>
		</Link>
	);
};

export default ProductItem;
