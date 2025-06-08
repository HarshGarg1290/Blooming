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
    const [resetEmail, setResetEmail] = useState("");
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
            } else if (currentState === "Login") {
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
            } else if (currentState === "Forgot Password") {
                const response = await axios.post(backendUrl + "/api/user/forgot-password", {
                    email: resetEmail,
                });

                if (response.data.success) {
                    toast.success("Password reset link sent to your email!");
                    setcurrentState("Login");
                    setResetEmail("");
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
            const redirectPath = location.state?.redirectTo || "/";
            navigate(redirectPath);
        }
    }, [token, navigate, location]);

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pt-24"
        >
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="font-hubot text-3xl">{currentState}</p>
                <hr className="border-none h-[2px] w-8 bg-gray-800" />
            </div>

            {currentState === "Forgot Password" ? (
                <>
                    <input
                        onChange={(e) => setResetEmail(e.target.value)}
                        value={resetEmail}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-800"
                        placeholder="Enter your email"
                        required
                    />
                    <p className="text-sm text-gray-600 text-center">
                        We'll send you a link to reset your password
                    </p>
                </>
            ) : (
                <>
                    {currentState === "Sign Up" && (
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-800"
                            placeholder="Name"
                            required
                        />
                    )}
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-800"
                        placeholder="Email"
                        required
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-800"
                        placeholder="Password"
                        required
                    />
                </>
            )}

            <div className="w-full flex justify-between text-sm mt-[-8px]">
                {currentState !== "Forgot Password" && (
                    <p
                        onClick={() => setcurrentState("Forgot Password")}
                        className="cursor-pointer hover:text-[#5c2674] transition-colors"
                    >
                        Forgot your Password?
                    </p>
                )}

                {currentState === "Login" ? (
                    <p
                        onClick={() => setcurrentState("Sign Up")}
                        className="cursor-pointer hover:text-[#5c2674] transition-colors"
                    >
                        Create Account
                    </p>
                ) : currentState === "Sign Up" ? (
                    <p
                        onClick={() => setcurrentState("Login")}
                        className="cursor-pointer hover:text-[#5c2674] transition-colors"
                    >
                        Login Here
                    </p>
                ) : (
                    <p
                        onClick={() => setcurrentState("Login")}
                        className="cursor-pointer hover:text-[#5c2674] transition-colors"
                    >
                        Back to Login
                    </p>
                )}
            </div>

            <button className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 transition-colors">
                {currentState === "Login"
                    ? "Sign In"
                    : currentState === "Sign Up"
                    ? "Sign Up"
                    : "Send Reset Link"}
            </button>
        </form>
    );
};

export default Login;
