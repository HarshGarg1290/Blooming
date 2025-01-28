import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";

import { backendUrl } from "../App";
import { toast } from "react-toastify";
const Add = ({ token }) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 0,
		sizes: [],
		features: [],
		washCare: [],
	
	});
	const [images, setImages] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const imagePreviews = files.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));

		setImages((prev) => [...prev, ...imagePreviews]);
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
		e.preventDefault(); // Prevent form from reloading the page

		const formDataToSend = new FormData();
		formDataToSend.append("name", formData.name);
		formDataToSend.append("description", formData.description);
		formDataToSend.append("price", formData.price);
		formDataToSend.append("sizes", JSON.stringify(formData.sizes));
		formDataToSend.append("features", JSON.stringify(formData.features));
		formDataToSend.append("washCare", JSON.stringify(formData.washCare));

		images.forEach(({ file }, index) => {
			formDataToSend.append(`image${index + 1}`, file);
		});

		try {
			const response = await axios.post(
				`${backendUrl}/api/product/add`,
				formDataToSend,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						token,
					},
				}
			);

			if (response.data.success) {
				toast.success(response.data.message);

				// Reset the form state
				setFormData({
					name: "",
					description: "",
					price: 0,
					sizes: [],
					features: [],
					washCare: [],
				});
				setImages([]);
			} else {
				toast.error(response.data.message || "Failed to add product");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred. Please try again.");
		}
	};

	return (
		<form
			className="flex flex-col w-[70%] items-start gap-3 sm:w-full"
			onSubmit={handleSubmit}
		>
			<div>
				<p className="mb-2">Upload Images</p>
				<div className="flex gap-2 flex-col sm:flex-row">
					<label>
						<img className="w-20 sm:w-20" src={assets.upload_area} alt="" />
						<input type="file" multiple onChange={handleImageUpload} hidden />
					</label>
					{images.map((image, index) => (
						<img
							key={index}
							className="w-20 h-20 object-cover flex "
							src={image.preview}
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
				<div className="flex gap-3 flex-wrap">
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

			<button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
				ADD
			</button>
		</form>
	);
};

export default Add;
