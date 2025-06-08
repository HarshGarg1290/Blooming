import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
    const {
        products,
        currency,
        cartItems,
        navigate,
        backendUrl,
        token,
        setCartItems,
    } = useContext(ShopContext);


    const [method, setMethod] = useState("cod");
    const [saveInfo, setSaveInfo] = useState(false);
    const [savedAddress, setSavedAddress] = useState(null);
    const [useSaved, setUseSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingAddress, setFetchingAddress] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
    });

 
    const cartData = useMemo(() => {
        const temp = [];
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    temp.push({
                        _id: items,
                        size: item,
                        quantity: cartItems[items][item],
                    });
                }
            }
        }
        return temp;
    }, [cartItems]);

    const shippingFee = useMemo(() => {
        return method === "razorpay" ? 0 : 80.0;
    }, [method]);

  
    const total = useMemo(() => {
        return cartData
            .reduce((total, item) => {
                const productData = products.find(
                    (product) => product._id === item._id
                );
                return total + (productData?.price || 0) * item.quantity;
            }, 0)
            .toFixed(2);
    }, [cartData, products]);

    const grandTotal = useMemo(
        () => (parseFloat(total) + shippingFee).toFixed(2),
        [total, shippingFee]
    );

 
    const onChangeHandler = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    
    const fetchDeliveryInfo = useCallback(async () => {
        if (!token || savedAddress) return;

        setFetchingAddress(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/saved`,
                {},
                { headers: { token } }
            );

            if (response.data.success) {
                setSavedAddress(response.data.deliveryDetails);
            }
        } catch (error) {
            console.log("Error fetching delivery details:", error);
        } finally {
            setFetchingAddress(false);
        }
    }, [backendUrl, token, savedAddress]);


    useEffect(() => {
        if (token) {
            fetchDeliveryInfo();
        }
    }, [fetchDeliveryInfo]);

   
    useEffect(() => {
        if (useSaved && savedAddress) {
            setFormData({
                firstName: savedAddress.firstName ?? "",
                lastName: savedAddress.lastName ?? "",
                email: savedAddress.email ?? "",
                address: savedAddress.address ?? "",
                apartment: savedAddress.apartment ?? "",
                city: savedAddress.city ?? "",
                state: savedAddress.state ?? "",
                zip: savedAddress.zip ?? "",
                phone: savedAddress.phone ?? "",
            });
        } else if (!useSaved) {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                apartment: "",
                city: "",
                state: "",
                zip: "",
                phone: "",
            });
        }
    }, [useSaved, savedAddress]);

  
    const initPay = useCallback((order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Order Payment",
            description: "Order Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (res) => {
                try {
                    const { data } = await axios.post(
                        `${backendUrl}/api/order/verifyRazorpay`,
                        res,
                        { headers: { token } }
                    );
                    if (data.success) {
                        navigate("/orders");
                        setCartItems({});
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Payment verification failed");
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }, [backendUrl, token, navigate, setCartItems]);

  
    const handlePlaceOrder = useCallback(async (e) => {
        e.preventDefault();
        
        if (cartData.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
       
            const orderItems = cartData.map(item => {
                const productData = products.find(product => product._id === item._id);
                if (productData) {
                    return {
                        ...productData,
                        size: item.size,
                        quantity: item.quantity
                    };
                }
                return null;
            }).filter(Boolean);

            const orderData = {
                user_details: formData,
                items: orderItems,
                amount: grandTotal,
                phone: formData.phone,
            };

     
            const apiCalls = [];

      
            if (saveInfo) {
                apiCalls.push(
                    axios.post(
                        `${backendUrl}/api/user/delivery`,
                        { deliveryDetails: formData },
                        { headers: { token } }
                    )
                );
            }


            const orderEndpoint = method === "cod" 
                ? "/api/order/place" 
                : "/api/order/razorpay";
            
            apiCalls.push(
                axios.post(
                    `${backendUrl}${orderEndpoint}`,
                    orderData,
                    { headers: { token } }
                )
            );

        
            const responses = await Promise.all(apiCalls);
            const orderResponse = responses[responses.length - 1]; 

            if (orderResponse.data.success) {
                if (method === "cod") {
                    setCartItems({});
                    navigate("/orders");
                    toast.success("Order placed successfully!");
                } else {
                    initPay(orderResponse.data.order);
                }
            } else {
                toast.error(orderResponse.data.message || "Order placement failed");
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [cartData, products, formData, grandTotal, saveInfo, method, backendUrl, token, setCartItems, navigate, initPay]);

    
    if (!products.length) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col justify-between sm:flex-row pt-8 sm:pt-14 min-h-[80vh] border-t"
        >
            {/* Cart Summary - Optimized with memoized data */}
            <div className="flex flex-col w-full sm:max-w-[480px] bg-gray-100 p-6 rounded-lg sm:order-2">
                <div className="font-hubot text-2xl mb-4 font-semibold text-gray-800">
                    Cart Summary
                </div>

                {cartData.length === 0 ? (
                    <div className="text-center text-gray-500">Your cart is empty</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cartData.map((item, index) => {
                            const productData = products.find(
                                (product) => product._id === item._id
                            );
                            if (!productData) return null;

                            return (
                                <div key={`${item._id}-${item.size}`} className="flex justify-between">
                                    <div className="flex text-lg text-gray-700 m-3">
                                        <img
                                            className="w-15 h-20 object-cover rounded mr-2"
                                            src={productData.image[0]}
                                            alt={productData.name}
                                            loading="lazy"
                                        />
                                        {productData.name} - {item.size}
                                    </div>
                                    <div className="font-medium text-gray-900 m-3">
                                        {currency}
                                        {(productData.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Optimized totals display */}
                <div className="mt-6 border-t pt-4 m-3">
                    <div className="flex justify-between text-gray-700">
                        <span>Total:</span>
                        <span className="font-bold">{currency}{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mt-2">
                        <span>Shipping Fee:</span>
                        <span className="font-bold">{currency}{shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-semibold mt-4">
                        <span>Grand Total:</span>
                        <span>{currency}{grandTotal}</span>
                    </div>
                </div>
            </div>

            {/* Delivery Information - Optimized form */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px] sm:order-1">
                <div className="flex items-center gap-2 font-hubot font-semibold text-xl sm:text-3xl my-3 mt-10">
                    <Title text1={"DELIVERY  "} text2={"INFORMATION "} />
                    <span className="hidden sm:block w-8 sm:w-12 sm:h-[3px] bg-[#000000]"></span>
                </div>

                {/* Saved Address Section with Loading State */}
                {fetchingAddress ? (
                    <div className="bg-gray-100 p-4 rounded animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ) : (
                    savedAddress && Object.values(savedAddress).some((value) => value) && (
                        <div className="bg-gray-100 p-4 rounded">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="addressOption"
                                    value="saved"
                                    checked={useSaved}
                                    onChange={() => setUseSaved(true)}
                                />
                                <span>Use Saved Address</span>
                            </label>
                            <p className="text-sm text-gray-700 ml-6">
                                {savedAddress.firstName || ""} {savedAddress.lastName || ""}
                                {savedAddress.address ? `, ${savedAddress.address}` : ""}
                                {savedAddress.city ? `, ${savedAddress.city}` : ""}
                                {savedAddress.state ? `, ${savedAddress.state}` : ""}
                                {savedAddress.zip ? `, ${savedAddress.zip}` : ""}
                                {savedAddress.phone ? `, ${savedAddress.phone}` : ""}
                            </p>

                            <label className="flex items-center gap-2 mt-3">
                                <input
                                    type="radio"
                                    name="addressOption"
                                    value="new"
                                    checked={!useSaved}
                                    onChange={() => setUseSaved(false)}
                                />
                                <span>Enter New Address</span>
                            </label>
                        </div>
                    )
                )}

                {/* Form Fields - Keep existing form structure */}
                <div className="flex gap-3">
                    <input
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="First Name"
                        aria-label="First Name"
                        required
                    />
                    <input
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="Last Name"
                        aria-label="Last Name"
                        required
                    />
                </div>

                <input
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="email"
                    placeholder="Email Address"
                    aria-label="Email Address"
                    required
                />
                <input
                    onChange={onChangeHandler}
                    name="address"
                    value={formData.address}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="text"
                    placeholder="Address"
                    aria-label="Address"
                    required
                />
                <input
                    onChange={onChangeHandler}
                    name="apartment"
                    value={formData.apartment}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="text"
                    placeholder="Apartment, Suite, etc (optional)"
                    aria-label="Apartment, Suite, etc"
                />
                <div className="flex gap-3">
                    <input
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="text"
                        placeholder="City"
                        aria-label="City"
                        required
                    />
                    <select
                        name="state"
                        value={formData.state}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full text-gray-400"
                        onChange={(e) => {
                            onChangeHandler(e);
                            e.target.classList.toggle("text-black", e.target.value !== "");
                            e.target.classList.toggle("text-gray-400", e.target.value === "");
                        }}
                        aria-label="State"
                        required
                    >
                        <option value="" disabled hidden>
                            Select State
                        </option>
                        {/* States */}
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>

                    <input
                        onChange={onChangeHandler}
                        name="zip"
                        value={formData.zip}
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        type="number"
                        placeholder="Pin Code"
                        aria-label="Pin Code"
                        required
                    />
                </div>
                <input
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="number"
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                    required
                />
                <label className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={() => setSaveInfo(!saveInfo)}
                    />
                    <span className="ml-2">Save delivery details for future orders</span>
                </label>

                {/* Payment Methods */}
                <div className="mt-7">
                    <div className="text-xl font-semibold">
                        <Title text1={"CHOOSE "} text2={"PAYMENT"} />
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="razorpay"
                                checked={method === "razorpay"}
                                onChange={() => setMethod("razorpay")}
                            />
                            <span>RazorPay (No shipping fee)</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={method === "cod"}
                                onChange={() => setMethod("cod")}
                            />
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                </div>

                {/* Optimized Place Order Button */}
                <button
                    type="submit"
                    disabled={cartData.length === 0 || loading}
                    className={`bg-black text-white py-2 px-4 rounded mt-8 font-semibold transition-all duration-200 ${
                        cartData.length === 0 || loading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-800 hover:scale-105"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Placing Order...
                        </div>
                    ) : (
                        "Place Order"
                    )}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;
