import { ShopContext } from "./ShopContext";
import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react"; // Add useMemo, useCallback
import { Bounce, toast } from "react-toastify";
import Cart from "../pages/Cart";
import { useNavigate } from "react-router-dom";

const ShopContextProvider = (props) => {
    const currency = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // State
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);

    // 🚀 OPTIMIZATION 1: Memoize heavy cart count calculation
    const getCartCount = useMemo(() => {
        return Object.values(cartItems).reduce((totalCount, sizes) => {
            return totalCount + Object.values(sizes).reduce((sizeCount, quantity) => {
                return sizeCount + (quantity > 0 ? quantity : 0);
            }, 0);
        }, 0);
    }, [cartItems]);

    // 🚀 OPTIMIZATION 2: Memoize cart amount calculation (cleaner version)
    const getCartAmount = useMemo(() => {
        return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
            const product = products.find(product => product._id === itemId);
            if (!product) return totalAmount;

            const itemAmount = Object.values(sizes).reduce((itemTotal, quantity) => {
                return itemTotal + (product.price * quantity);
            }, 0);

            return totalAmount + itemAmount;
        }, 0);
    }, [cartItems, products]);

  
    const getProductsData = useCallback(async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list");
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendUrl]);

    const getUserCart = useCallback(async (token) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/cart/get",
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendUrl]);

    // 🚀 OPTIMIZATION 4: Optimize addToCart function
    const addToCart = useCallback(async (itemId, size) => {
        if (!size) {
            toast("Select Product Size !!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                className: `
                    bg-purple-400 text-white font-semibold rounded-lg shadow-xl 
                    border border-purple-400 p-4 text-sm transform hover:scale-105 
                    transition-all duration-300 ease-in-out
                `,
                progressClassName: `bg-purple-400 h-[2px]`,
            });
            return;
        }

        setCartItems(prevCartItems => {
            const cartData = structuredClone(prevCartItems);
            
            if (cartData[itemId]) {
                cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
            } else {
                cartData[itemId] = { [size]: 1 };
            }
            
            return cartData;
        });

        // API call for authenticated users
        if (token) {
            try {
                await axios.post(
                    backendUrl + "/api/cart/add",
                    { itemId, size },
                    { headers: { token } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
        
        setIsCartOpen(true);
    }, [token, backendUrl]);

    // 🚀 OPTIMIZATION 5: Optimize updateCartQuantity
    const updateCartQuantity = useCallback(async (itemId, size, newQuantity) => {
        setCartItems(prevCartItems => {
            const cartData = structuredClone(prevCartItems);

            if (newQuantity === 0) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                cartData[itemId][size] = newQuantity;
            }

            return cartData;
        });

        if (token) {
            try {
                await axios.post(
                    backendUrl + "/api/cart/update",
                    { itemId, size, quantity: newQuantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }, [token, backendUrl]);

    const toggleCart = useCallback(() => {
        setIsCartOpen(prev => !prev);
    }, []);

    // Effects
    useEffect(() => {
        getProductsData();
    }, [getProductsData]);

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
        }
    }, [getUserCart]);

    // 🚀 OPTIMIZATION 6: Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        products,
        currency,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        setCartItems,
        cartItems,
        addToCart,
        getCartCount, // Now this is a memoized value, not a function
        getCartAmount, // Add this if you need cart total amount
        isCartOpen,
        toggleCart,
        updateCartQuantity,
        navigate,
        backendUrl,
        token,
        setToken,
    }), [
        products,
        search,
        showSearch,
        cartItems,
        addToCart,
        getCartCount,
        getCartAmount,
        isCartOpen,
        toggleCart,
        updateCartQuantity,
		token,
		navigate,
		backendUrl
    ]);

    return (
        <ShopContext.Provider value={value}>
            {props.children}
            {isCartOpen && <Cart isOpen={isCartOpen} onClose={toggleCart} />}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
