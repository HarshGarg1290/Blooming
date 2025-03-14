import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({token}) => {
	const [list, setList] = useState([]);

	const fetchList = async () => {
		try {
			const response = await axios.get(backendUrl + "/api/product/list");
			if (response.data.success) {
				console.log(response.data);

				setList(response.data.products);
			}
			toast.error(response.data.message);
		} catch (error) {
			console.log(error);

			toast.error(error.message);
		}
	};


	const removeProduct = async (id) => {
		try {
			const response = await axios.post(backendUrl + "/api/product/remove" , {id} , {headers:{token}})
		
			if (response.data.success) {
				toast.success(response.data.message)
				await fetchList();
			}

			else {
				toast.error(response.data.message)

			}
		} catch (error) {
			console.log(error);

			toast.error(error.message);
		}
	}

	useEffect(() => {
		fetchList();
	}, []);
	return (
		<>
			<p className="mb-2">Product List</p>
			<div className="flex flex-col  gap-2 ">
				<div className=" w-[83%] hidden md:grid grid-cols-[1fr_3fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
					<b>IMAGE</b>
					<b>NAME</b>
					<b>PRICE</b>
					
				</div>

				{list.map((item, index) => (
					<div
						className="grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_3fr_1fr_1fr] items-center gap-4 sm:gap-2 py-1  px-2 border text-sm"
						key={index}
					>
						<img className="w-12" src={item.image[0]} alt="" />
						<p>{item.name}</p>

						<p className="ml-2 sm:mx-0">
							{currency}
							{item.price}
						</p>
						
							<p
								onClick={() => removeProduct(item._id)}
								className=" text-center md:text-center cursor-pointer text-lg bg-red-600 text-white mx-16  "
							>
								x
							</p>
						
					</div>
				))}
			</div>
		</>
	);
};

export default List;
