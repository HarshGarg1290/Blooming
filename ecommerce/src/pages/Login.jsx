import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Login = () => {
	const [currentState, setcurrentState] = useState("Login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const location = useLocation();

	const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
	const onSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			if (currentState === "Sign Up") {
				const response = await axios.post(backendUrl + "/api/user/register", {
					name,
					email,
					password,
				});
				if (response.data.success) {
					setToken(response.data.token);
					localStorage.setItem("token", response.data.token);
				} else {
					toast.error(response.data.message);
				}
			} else {
				const response = await axios.post(backendUrl + "/api/user/login", {
					email,
					password,
				});

				if (response.data.success) {
					setToken(response.data.token);
					localStorage.setItem("token", response.data.token);
				} else {
					toast.error(response.data.message);
				}
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (token) {
			// Check if there's a redirectTo path in the location state
			const redirectPath = location.state?.redirectTo || "/";
			navigate(redirectPath);
		}
	}, [token, navigate, location]);

	return (
		<form
			onSubmit={onSubmitHandler}
			className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pt-24"
			action=""
		>
			<div className="inline-flex items-center gap-2 mb-2 mt-10">
				<p className="font-hubot text-3xl">{currentState}</p>
				<hr className="border-none h-[2px] w-8 bg-gray-800" />
			</div>

			{currentState === "Login" ? (
				""
			) : (
				<input
					onChange={(e) => setName(e.target.value)}
					value={name}
					type="text"
					className="w-full px-3 py-2 border border-gray-800 "
					placeholder="Name"
					required
				/>
			)}
			<input
				onChange={(e) => setEmail(e.target.value)}
				value={email}
				type="text"
				className="w-full px-3 py-2 border border-gray-800 "
				placeholder="Email"
				required
			/>
			<input
				onChange={(e) => setPassword(e.target.value)}
				value={password}
				type="text"
				className="w-full px-3 py-2 border border-gray-800 "
				placeholder="Password"
				required
			/>

			<div className="w-full flex justify-between tetx-sm mt-[-8px] ">
				<p>Forgot your Password?</p>
				{currentState === "Login" ? (
					<p
						onClick={() => setcurrentState("Sign Up")}
						className="cursor-pointer "
					>
						Create Account
					</p>
				) : (
					<p
						onClick={() => setcurrentState("Login")}
						className="cursor-pointer "
					>
						Login Here
					</p>
				)}
			</div>
			<button className="bg-black text-white font-light px-8 py-2 mt-4 ">
				{" "}
				{currentState === "Login" ? "Sign In" : "Sign Up"}
			</button>
		</form>
	);
};

export default Login;
