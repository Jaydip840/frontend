import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    // const url = "https://foodmasters-backend.onrender.com"
    const url = "http://localhost:4000"
    const [cartItems, setCartItems] = useState({});
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([])

    const ingredientMap = {
        "Pizza": [
            { name: "Extra Cheese", price: 40 },
            { name: "Mushroom", price: 30 },
            { name: "Paneer Tikka", price: 50 },
            { name: "Oregano & Flakes", price: 10 }
        ],
        "Burger": [
            { name: "Cheese Slice", price: 20 },
            { name: "Extra Veg Patty", price: 40 },
            { name: "Jalapenos", price: 15 },
            { name: "Extra Mayo", price: 10 }
        ],
        "Pasta": [
            { name: "Extra Cheese", price: 35 },
            { name: "Garlic Bread", price: 45 },
            { name: "Bell Peppers", price: 20 }
        ],
        "Salad": [
            { name: "Avocado", price: 50 },
            { name: "Roasted Nuts", price: 30 },
            { name: "Feta Cheese", price: 40 },
            { name: "Tofu", price: 35 }
        ],
        "Rolls": [
            { name: "Extra Cheese", price: 30 },
            { name: "Spicy Chutney", price: 10 },
            { name: "Veggie Mix", price: 20 }
        ],
        "Sandwich": [
            { name: "Butter", price: 10 },
            { name: "Extra Cheese", price: 25 },
            { name: "Grilled Veggies", price: 20 }
        ],
        "Cake": [
            { name: "Extra Frosting", price: 30 },
            { name: "Fruit Bits", price: 25 },
            { name: "Chocolate Chips", price: 20 }
        ],
        "Soup": [
            { name: "Croutons", price: 15 },
            { name: "Cream Swirl", price: 10 },
            { name: "Herbs", price: 5 }
        ],
        "Noodles": [
            { name: "Extra Veggies", price: 25 },
            { name: "Spicy Sauce", price: 10 },
            { name: "Tofu Cubes", price: 30 }
        ],
        "Desserts": [
            { name: "Chocolate Sauce", price: 20 },
            { name: "Nuts", price: 25 },
            { name: "Whipped Cream", price: 15 }
        ],
        "Drinks": [
            { name: "Extra Ice", price: 0 },
            { name: "Mint Leaves", price: 5 },
            { name: "Lemon Slice", price: 5 }
        ],
        "default": [
            { name: "Extra Napkins", price: 0 },
            { name: "Extra Cutlery", price: 0 }
        ]
    }

    const getItemCount = (itemId) => {
        let count = 0;
        for (const key in cartItems) {
            if (key.startsWith(itemId + "_")) {
                count += cartItems[key];
            }
        }
        return count;
    }

    const addToCart = async (itemId, size = "Small", extras = [], quantity = 1) => {
        const cartKey = `${itemId}_${size}_${extras.sort().join(",")}`;

        setCartItems((prev) => {
            const currentCount = prev[cartKey] || 0;
            return { ...prev, [cartKey]: currentCount + quantity };
        });

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId, size, extras, quantity }, { headers: { token } })
        }
    }

    const removeFromCart = async (cartKey) => {
        setCartItems((prev) => {
            const currentCount = prev[cartKey];
            if (!currentCount) return prev;
            if (currentCount <= 1) {
                const newCart = { ...prev };
                delete newCart[cartKey];
                return newCart;
            }
            return { ...prev, [cartKey]: currentCount - 1 };
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { cartKey }, { headers: { token } })
        }
    }

    const removeFromCartById = async (itemId) => {
        // Find the first key that starts with this itemId
        const cartKey = Object.keys(cartItems).find(key => key.startsWith(itemId + "_"));
        if (cartKey) {
            await removeFromCart(cartKey);
        }
    }

    const removeAllFromCart = async (cartKey) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[cartKey];
            return newCart;
        });

        if (token) {
            // Assuming backend supports a 'clear specific' endpoint or we send quantity 0
            // If backend only has 'remove', we might need a new endpoint or call remove in a loop (not ideal)
            // For now, let's assume we can pass a 'remove_all' flag or similar if supported, 
            // otherwise we'll just update the local state and sync.
            await axios.post(url + "/api/cart/remove", { cartKey, removeAll: true }, { headers: { token } })
        }
    }

    const clearCart = async () => {
        setCartItems({});
        if (token) {
            await axios.post(url + "/api/cart/clear", {}, { headers: { token } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const cartKey in cartItems) {
            if (cartItems[cartKey] > 0) {
                const [itemId, size, extrasStr] = cartKey.split("_");
                const extras = extrasStr ? extrasStr.split(",") : [];

                let itemInfo = food_list.find((product) => product._id === itemId);
                if (itemInfo) {
                    let itemPrice = itemInfo.price;

                    // Size multipliers
                    if (size === "Medium") itemPrice *= 1.25;
                    else if (size === "Large") itemPrice *= 1.5;

                    // Extras pricing (dynamic lookup)
                    const categoryExtras = ingredientMap[itemInfo.category] || ingredientMap["default"];
                    extras.forEach(extraName => {
                        const option = categoryExtras.find(o => o.name === extraName);
                        if (option) itemPrice += option.price;
                    });

                    totalAmount += Math.round(itemPrice) * cartItems[cartKey];
                }
            }
        }
        return totalAmount;
    }

    const [itemRatings, setItemRatings] = useState(() => {
        const saved = localStorage.getItem("itemRatings");
        return saved ? JSON.parse(saved) : {};
    });

    const updateRating = (itemId, rating) => {
        setItemRatings(prev => ({ ...prev, [itemId]: rating }));
    };

    useEffect(() => {
        localStorage.setItem("itemRatings", JSON.stringify(itemRatings));
    }, [itemRatings]);

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list")
        setFoodList(response.data.data)
    }
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            
            // Check for Admin Auto-Login URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const adminToken = urlParams.get('adminToken');
            const adminEmail = urlParams.get('adminEmail');
            
            if (adminToken && adminEmail) {
                // Save admin token and mock email to localStorage
                localStorage.setItem("token", adminToken);
                localStorage.setItem("email", adminEmail);
                
                // Clear the URL to avoid showing the token securely
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

    const [deliveryFee, setDeliveryFee] = useState(50);
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        deliveryFee,
        setDeliveryFee,
        role,
        setRole,
        ingredientMap,
        getItemCount,
        removeFromCartById,
        removeAllFromCart,
        clearCart,
        itemRatings,
        updateRating
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;