import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
	const { productId } = useParams();
	const {
		products,
		currency,

		addToCart,
	} = useContext(ShopContext);

	const [productData, setProductData] = useState(null);
	const [size, setSize] = useState("");
	const [image, setImage] = useState("");
	const [openSection, setOpenSection] = useState(null);

	useEffect(() => {
		const product = products.find((item) => item._id === productId);

		if (product) {
			setProductData(product);
			setImage(product.image[0]);
		}
	}, [productId, products]);

	if (!productData) {
		return <div>Loading...</div>;
	}

	const toggleSection = (section) => {
		setOpenSection(openSection === section ? null : section);
	};

	return productData ? (
		<div className="border-t-2 pt-24 mb-[100px] sm:mb-[150px]">
			<div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
				<div className="flex-1 flex flex-col-reverse gap-6 sm:flex-row ">
					<div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify sm:w-[18.7%] w-full max-h-[700px] sm:border-r-2 ">
						{productData.image.map((item, index) => (
							<img
								onClick={() => setImage(item)}
								src={item}
								key={index}
								className="w-[20%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 sm:border-0 "
								alt=""
							/>
						))}
					</div>
					<div className="w-full sm:w-[80%]   ">
						<img src={image} alt="" className="w-full h-auto " />
					</div>
				</div>

				<div className="flex-1">
					<h1 className="font-hubot font-medium text-2xl mt-2">
						{productData.name}
					</h1>
					<p className="mt-5 text-2xl font-medium font-raleway">
						{currency}
						{productData.price}
					</p>

					{/* Size Selection */}
					<div className="flex flex-col gap-4 my-8 font-raleway">
						<p>SELECT SIZE</p>
						<div className="flex gap-2">
							{productData.sizes.map((item, index) => (
								<button
									onClick={() => setSize(item)}
									className={`border py-2 px-4 bg-gray-100 ${
										item === size ? "border-purple-300" : ""
									}`}
									key={index}
								>
									{item}
								</button>
							))}
						</div>
					</div>
					<button
						onClick={() => addToCart(productData._id, size)}
						className="bg-[#E6E6FA] px-8 py-3 text-sm active:bg-gray-300"
					>
						ADD TO CART
					</button>

					<div className="mt-10">
						<div className="border-t font-raleway">
							{[
								{ title: "DESCRIPTION", content: productData.description },
								{
									title: "FEATURES",
									content: (
										<ul className="list-disc list-inside">
											{productData.features.map((feature, index) => (
												<li key={index}>{feature}</li>
											))}
										</ul>
									),
								},

								{
									title: "WASH CARE",
									content: (
										<ul className="list-disc list-inside">
											{productData.washCare.map((item, index) => (
												<li key={index}>{item}</li>
											))}
										</ul>
									),
								},
								{
									title: "SHIPPING & EXCHANGE POLICY",
									content: (
										<ul className="list-disc list-inside">
											<li>Free shipping on all orders.</li>
											<li>
												Standard shipping takes 5-7 business days.
												Charges applicable in case of express shipping
												(subjective to availability )
											</li>
											<li>
												3 day return policy on products with original tags
												intact.
											</li>
				
											<li>
												Exchange and refund requests are
												processed within 7 days.
											</li>
										</ul>
									),
								},
							].map((section, index) => (
								<div key={index} className="border-b">
									<button
										onClick={() => toggleSection(section.title)}
										className="flex justify-between items-center w-full py-3 px-5 text-left text-sm font-medium"
									>
										<span>{section.title}</span>
										<span className="text-2xl font-normal">
											{openSection === section.title ? "-" : "+"}
										</span>
									</button>
									{openSection === section.title && (
										<div className="px-5 py-4 text-gray-500 text-sm">
											{section.content}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="opacity-0"></div>
	);
};

export default Product;
