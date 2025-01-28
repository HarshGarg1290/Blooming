import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";

import { backendUrl } from "../App";
const Add = ({ token }) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 0,
		images: [],
		sizes: [],
		features: [],
		washCare: [],
		shippingExchangePolicy: [],
		date: Date.now(),
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const imageUrls = files.map((file) => URL.createObjectURL(file));
		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ...imageUrls],
		}));
	};

	const toggleSize = (size) => {
		setFormData((prev) => {
			const sizes = prev.sizes.includes(size)
				? prev.sizes.filter((s) => s !== size)
				: [...prev.sizes, size];
			return { ...prev, sizes };
		});
	};

	const handleListInput = (key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: [...prev[key], value],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				backendUrl + "/api/product/add",
				formData,
				{ headers: { token } }
			);
			console.log(response.data);
		} catch (error) {}
	};

	return (
		<form
			className="flex flex-col w-full items-start gap-3"
			onSubmit={handleSubmit}
		>
			<div>
				<p className="mb-2">Upload Images</p>
				<div className="flex gap-2">
					<label>
						<img className="w-20" src={assets.upload_area} alt="" />
						<input type="file" multiple onChange={handleImageUpload} hidden />
					</label>
					{formData.images.map((img, index) => (
						<img
							key={index}
							className="w-20"
							src={img}
							alt={`Uploaded ${index}`}
						/>
					))}
				</div>
			</div>

			<div className="w-full">
				<p className="mb-2">Product Name</p>
				<input
					className="w-full max-w-[500px] px-3 py-2"
					type="text"
					placeholder="Type here"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div className="w-full">
				<p className="mb-2">Product Description</p>
				<textarea
					className="w-full max-w-[500px] px-3 py-2"
					placeholder="Write product details"
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div className="w-full">
				<p className="mb-2">Product Price</p>
				<input
					className="w-full px-3 py-2 max-w-[120px]"
					type="number"
					placeholder="0"
					name="price"
					value={formData.price}
					onChange={handleInputChange}
					required
				/>
			</div>
			<div>
				<p className="mb-2">Product Sizes</p>
				<div className="flex gap-3">
					{["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
						<div key={size}>
							<p
								className={`px-3 py-1 cursor-pointer ${
									formData.sizes.includes(size)
										? "bg-gray-500 text-white"
										: "bg-slate-200"
								}`}
								onClick={() => toggleSize(size)}
							>
								{size}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="w-full">
				<p className="mb-2">Features</p>
				<input
					className="w-full px-3 py-2 max-w-[500px]"
					type="text"
					placeholder="Add feature and press Enter"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleListInput("features", e.target.value);
							e.target.value = "";
						}
					}}
				/>
				<ul>
					{formData.features.map((feature, index) => (
						<li key={index}>{feature}</li>
					))}
				</ul>
			</div>

			<div className="w-full">
				<p className="mb-2">Wash Care</p>
				<input
					className="w-full px-3 py-2 max-w-[500px]"
					type="text"
					placeholder="Add wash care and press Enter"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleListInput("washCare", e.target.value);
							e.target.value = "";
						}
					}}
				/>
				<ul>
					{formData.washCare.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			</div>

			<div className="w-full">
				<p className="mb-2">Shipping and Exchange Policy</p>
				<input
					className="w-full px-3 py-2 max-w-[500px]"
					type="text"
					placeholder="Add policy and press Enter"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleListInput("shippingExchangePolicy", e.target.value);
							e.target.value = "";
						}
					}}
				/>
				<ul>
					{formData.shippingExchangePolicy.map((policy, index) => (
						<li key={index}>{policy}</li>
					))}
				</ul>
			</div>

			<button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
				ADD
			</button>
		</form>
	);
};

export default Add;
