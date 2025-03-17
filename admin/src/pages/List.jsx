import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
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
		setFormData({ ...product });
	};

	// Handle Form Change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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
				<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
					<div className="bg-white p-6 rounded shadow-md w-1/2">
						<h2 className="text-xl mb-4">Edit Product</h2>

						<label>Name:</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
						/>

						<label>Description:</label>
						<input
							type="text"
							name="description"
							value={formData.description}
							onChange={handleChange}
							className="border p-2 w-full mb-2"
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
								className="bg-green-500 text-white px-4 py-2 rounded"
							>
								Update
							</button>
							<button
								onClick={() => setEditingProduct(null)}
								className="bg-red-500 text-white px-4 py-2 rounded"
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
