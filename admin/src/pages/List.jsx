import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const List = ({ token }) => {
	const [list, setList] = useState([]);
	const [editingProduct, setEditingProduct] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		sizes: "",
		features: "",
		washCare: "",
		images: [],
	});
	const [uploading, setUploading] = useState(false);

	const fetchList = async () => {
		try {
			const response = await axios.get(backendUrl + "/api/product/list");
			if (response.data.success) {
				setList(response.data.products);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const removeProduct = async (id) => {
		try {
			const response = await axios.post(
				backendUrl + "/api/product/remove",
				{ id },
				{ headers: { token } }
			);
			if (response.data.success) {
				toast.success(response.data.message);
				await fetchList();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Open Edit Form
	const editProduct = (product) => {
		setEditingProduct(product);
		setFormData({ ...product, images: product.image || [] });
	};

	// Handle Form Change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle Image Upload
	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);
		setUploading(true);

		const uploadedImages = await Promise.all(
			files.map(async (file) => {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("upload_preset", "product"); // Replace with your preset

				try {
					const response = await fetch(
						"https://api.cloudinary.com/v1_1/dufctt2le/image/upload",
						{
							method: "POST",
							body: formData,
						}
					);
					const data = await response.json();
					return data.secure_url; // Cloudinary URL
				} catch (error) {
					console.error("Upload failed", error);
					toast.error("Image upload failed");
					return null;
				}
			})
		);

		// Filter out failed uploads and update state
		const validImages = uploadedImages.filter((url) => url);
		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ...validImages],
		}));
		setUploading(false);
	};

	// Handle Remove Image
	const handleRemoveImage = (index) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	// Update Product
	const updateProduct = async () => {
		try {
			const response = await axios.post(
				backendUrl + "/api/product/update",
				{ ...formData, id: editingProduct._id },
				{ headers: { token } }
			);

			if (response.data.success) {
				toast.success("Product updated successfully");
				setEditingProduct(null);
				await fetchList();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	return (
		<>
			<p className="mb-2">Product List</p>
			<div className="flex flex-col gap-2">
				<div className="w-[100%] hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-4 items-center py-1 px-2 border bg-gray-100 text-sm">
					<b>IMAGE</b>
					<b>NAME</b>
					<b>PRICE</b>
					<b>ACTIONS</b>
				</div>

				{list.map((item, index) => (
					<div
						key={index}
						className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-1 px-2 border text-sm"
					>
						<img className="w-12" src={item.image[0]} alt="" />
						<p>{item.name}</p>
						<p className="ml-2 sm:mx-0">
							{currency}
							{item.price}
						</p>
						<p
							onClick={() => removeProduct(item._id)}
							className="cursor-pointer text-lg text-center bg-red-600 text-white mx-4 sm:mx-0 p-1"
						>
							x
						</p>
						<p
							onClick={() => editProduct(item)}
							className="cursor-pointer text-lg bg-blue-600 text-center text-white mx-4 sm:mx-0  p-1"
						>
							✏️
						</p>
					</div>
				))}
			</div>

			{/* Edit Product Modal */}
			{editingProduct && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-y-auto">
					<div className="bg-white p-6 rounded shadow-md w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto my-4">
						<h2 className="text-xl mb-4 font-bold">Edit Product</h2>

						{/* Image Upload Section */}
						<div className="mb-4">
							<label className="block mb-2 font-semibold">
								Product Images:
							</label>
							<div className="flex gap-2 flex-wrap mb-2">
								{formData.images &&
									formData.images.map((image, index) => (
										<div key={index} className="relative w-20 h-20">
											<img
												className="w-20 h-20 object-cover border rounded"
												src={image}
												alt={`Product ${index}`}
											/>
											<button
												type="button"
												className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full hover:bg-red-700"
												onClick={() => handleRemoveImage(index)}
											>
												X
											</button>
										</div>
									))}

								{/* Upload new images */}
								<label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
									<span className="text-3xl text-gray-400">+</span>
									<input
										type="file"
										multiple
										accept="image/*"
										onChange={handleImageUpload}
										hidden
									/>
								</label>

								{uploading && (
									<div className="w-20 h-20 flex items-center justify-center">
										<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
									</div>
								)}
							</div>
							<p className="text-xs text-gray-500">
								Click + to add more images or X to remove
							</p>
						</div>

						<label>Name:</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
						/>

						<label>Description:</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							className="border p-2 w-full mb-2 min-h-[80px]"
						/>

						<label>Price:</label>
						<input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
						/>

						<label>Sizes (comma separated):</label>
						<input
							type="text"
							name="sizes"
							value={formData.sizes}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
						/>

						<label>Features (comma separated):</label>
						<input
							type="text"
							name="features"
							value={formData.features}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
						/>

						<label>Wash Care (comma separated):</label>
						<input
							type="text"
							name="washCare"
							value={formData.washCare}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
						/>

						<div className="flex justify-between mt-4">
							<button
								onClick={updateProduct}
								className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
							>
								Update
							</button>
							<button
								onClick={() => setEditingProduct(null)}
								className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default List;

List.propTypes = {
	token: PropTypes.string,
};
