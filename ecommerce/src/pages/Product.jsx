import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Star, StarHalf, X } from "lucide-react";

// Review Form Modal Component
const ReviewFormModal = ({ productId, onSubmitReview, onClose }) => {
	const [name, setName] = useState("");
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const [images, setImages] = useState([]);
	const [hoverRating, setHoverRating] = useState(0);

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const imageUrls = files.map((file) => URL.createObjectURL(file));
		setImages((prev) => [...prev, ...imageUrls]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newReview = {
			productId,
			name,
			rating,
			review,
			images,
			date: new Date().toISOString(),
		};
		onSubmitReview(newReview);
		// Reset form and close modal
		setName("");
		setRating(0);
		setReview("");
		setImages([]);
		onClose();
	};

	const renderStars = (currentRating, isHover = false) => {
		return [1, 2, 3, 4, 5].map((star) => {
			const filled = isHover ? star <= hoverRating : star <= currentRating;
			const halfFilled =
				!isHover &&
				currentRating % 1 !== 0 &&
				Math.floor(currentRating) + 1 === star;

			return (
				<span
					key={star}
					onMouseEnter={() => setHoverRating(star)}
					onMouseLeave={() => setHoverRating(0)}
					onClick={() => setRating(star)}
					className="cursor-pointer"
				>
					{halfFilled ? (
						<StarHalf className="text-yellow-500 inline-block" fill="#fbbf24" />
					) : filled ? (
						<Star className="text-yellow-500 inline-block" fill="#fbbf24" />
					) : (
						<Star className="text-gray-300 inline-block" />
					)}
				</span>
			);
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
				>
					<X size={24} />
				</button>
				<form onSubmit={handleSubmit} className="space-y-4 p-6">
					<h2 className="text-xl font-semibold mb-4">Write a Review</h2>

					<div>
						<label className="block mb-2">Your Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border p-2 rounded"
							required
						/>
					</div>

					<div>
						<label className="block mb-2">Rating</label>
						<div className="flex items-center">{renderStars(rating)}</div>
					</div>

					<div>
						<label className="block mb-2">Your Review</label>
						<textarea
							value={review}
							onChange={(e) => setReview(e.target.value)}
							className="w-full border p-2 rounded"
							rows="4"
							required
						/>
					</div>

					<div>
						<label className="block mb-2">Upload Images (Optional)</label>
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={handleImageUpload}
							className="w-full border p-2 rounded"
						/>
						{images.length > 0 && (
							<div className="flex gap-2 mt-2">
								{images.map((img, index) => (
									<img
										key={index}
										src={img}
										alt={`Review upload ${index + 1}`}
										className="w-20 h-20 object-cover rounded"
									/>
								))}
							</div>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
					>
						Submit Review
					</button>
				</form>
			</div>
		</div>
	);
};

const Product = () => {
	const { productId } = useParams();
	const {
		products,
		currency,
		reviews = [],
		addReview,
		addToCart,
	} = useContext(ShopContext);

	const [productData, setProductData] = useState(null);
	const [size, setSize] = useState("");
	const [image, setImage] = useState("");
	const [openSection, setOpenSection] = useState(null);
	const [showReviewModal, setShowReviewModal] = useState(false);

	// Filter reviews for this specific product
	const productReviews = reviews.filter(
		(review) => review.productId === productId
	);

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

	const handleSubmitReview = (newReview) => {
		// Validate review
		if (!newReview.name || !newReview.review || newReview.rating === 0) {
			alert("Please fill in all required fields and provide a rating.");
			return;
		}

		// Generate a unique ID
		const reviewWithId = {
			...newReview,
			id: Date.now().toString(),
		};

		// Add the review to context
		addReview(reviewWithId);
	};

	const calculateAverageRating = () => {
		if (productReviews.length === 0) return 0;
		const totalRating = productReviews.reduce(
			(sum, review) => sum + review.rating,
			0
		);
		return (totalRating / productReviews.length).toFixed(1);
	};

	return productData ? (
		<div className="border-t-2 pt-24 mb-[100px] sm:mb-[150px]">
			{/* Review Form Modal (Conditionally Rendered) */}
			{showReviewModal && (
				<ReviewFormModal
					productId={productId}
					onSubmitReview={handleSubmitReview}
					onClose={() => setShowReviewModal(false)}
				/>
			)}

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

						<div className="flex mt-3 h-3 gap-[2px] ">
							{[...Array(5)].map((_, index) => (
								<Star
									key={index}
									className={
										index < Math.round(calculateAverageRating())
											? "text-yellow-400 w-4 h-4"
											: "text-gray-300 w-4 h-4"
									}
									fill={
										index < Math.round(calculateAverageRating())
											? "#fbbf24"
											: "currentColor"
									}
								/>
							))}
						</div>
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
									title: "REVIEWS",
									content: (
										<div>
											{productReviews.length === 0 ? (
												<div className="text-center">
													<p className="text-gray-500 mb-4">No reviews yet</p>
													<button
														onClick={() => setShowReviewModal(true)}
														className="bg-[#E6E6FA] text-black px-4 py-2 rounded hover:bg-purple-600 hover:text-white"
													>
														Write First Review
													</button>
												</div>
											) : (
												<div>
													<div className="flex justify-between items-center mb-4">
														<div>
															<h3 className="text-base sm:text-xl sm:font-medium">
																Customer Reviews ({productReviews.length})
															</h3>
														</div>
														<button
															onClick={() => setShowReviewModal(true)}
															className="bg-[#E6E6FA] text-black px-4 py-2 rounded hover:bg-purple-600 hover:text-white"
														>
															Write a Review
														</button>
													</div>

													{/* Display existing reviews */}
													{productReviews.map((review, index) => (
														<div key={index} className="border-b py-4">
															<div className="flex justify-between items-center mb-2">
																<h4 className="text-base font-bold">
																	{review.name}
																</h4>
																<div>
																	{[...Array(5)].map((_, starIndex) => (
																		<Star
																			key={starIndex}
																			className={
																				starIndex < review.rating
																					? "text-yellow-500 inline-block w-3 h-3"
																					: "text-gray-300 inline-block w-3 h-3"
																			}
																			fill={
																				starIndex < review.rating
																					? "#fbbf24"
																					: "currentColor"
																			}
																		/>
																	))}
																</div>
															</div>
															<p className="text-gray-600 mb-2">
																{review.review}
															</p>
															{review.images && review.images.length > 0 && (
																<div className="flex gap-2 mt-2">
																	{review.images.map((img, imgIndex) => (
																		<img
																			key={imgIndex}
																			src={img}
																			alt={`Review image ${imgIndex + 1}`}
																			className="w-20 h-20 object-cover rounded"
																		/>
																	))}
																</div>
															)}
														</div>
													))}
												</div>
											)}
										</div>
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
											<li>Free shipping on all orders over $50.</li>
											<li>Standard shipping takes 5-7 business days.</li>
											<li>Expedited shipping options available at checkout.</li>
											<li>
												30-day return policy for unworn and unwashed items.
											</li>
											<li>
												Exchange requests are processed within 7 business days.
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
