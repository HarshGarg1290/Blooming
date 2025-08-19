import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { transformCloudinary } from "../utils/image";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, eager = false }) => {
	const { currency } = useContext(ShopContext);
	const base = image?.[0] || "";
	// Build responsive candidates (4:5 aspect -> height = width * 1.25)
	const widths = [320, 480, 640, 768, 960];
	const src = transformCloudinary(base, { width: 640, height: 800 });
	const srcSet = widths
		.map((w) => {
			const h = Math.round(w * 1.25);
			return `${transformCloudinary(base, { width: w, height: h })} ${w}w`;
		})
		.join(", ");
	// Grid heuristics: desktop ~25vw, tablet ~33vw, mobile ~50vw
	const sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";
	return (
		<Link className="text-gray-700 cursor-pointer block" to={`/product/${id}`}>
			<div className="space-y-2">
				{/* Aspect ratio wrapper to prevent layout shifts and image pop-in */}
				<div className="overflow-hidden p-4">
					<div className="relative w-full aspect-[4/5]">
						<img
							className="absolute inset-0 w-full h-full object-cover object-center hover:scale-110 transition ease-in-out duration-700"
							style={{ objectPosition: "center top" }}
							src={src}
							srcSet={srcSet}
							sizes={sizes}
							alt={name}
							width={640}
							height={800}
							loading={eager ? "eager" : "lazy"}
							decoding={eager ? "sync" : "async"}
							fetchPriority={eager ? "high" : "auto"}
							onError={(e) => {
								e.target.src = "/placeholder.png";
								e.target.alt = "Image not available";
							}}
						/>
					</div>
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
