import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000"; // 🔹 Apne backend ka URL yaha dalna
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // ----------------------------
  // 🟢 Load Cart Data from Backend
  // ----------------------------
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("loadCartData error:", error);
    }
  };

  // ----------------------------
  // 🟢 Add Item to Cart
  // ----------------------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const id = String(itemId);
      return { ...prev, [id]: (prev[id] || 0) + 1 };
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (e) {
        console.log("addToCart error:", e);
      }
    }
  };

  // ----------------------------
  // 🟢 Remove Item from Cart
  // ----------------------------
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const id = String(itemId);
      const count = prev[id] > 0 ? prev[id] - 1 : 0;
      return { ...prev, [id]: count };
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (e) {
        console.log("removeFromCart error:", e);
      }
    }
  };

  // ----------------------------
  // 🟢 Clear Cart (Payment Success OR Logout)
  // ----------------------------
  const clearCart = async () => {
    setCartItems({}); // frontend reset
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/clear",
          {},
          { headers: { token } }
        );
      } catch (e) {
        console.log("clearCart error:", e);
      }
    }
  };

  // ----------------------------
  // 🟢 Calculate Total Amount
  // ----------------------------
  const getTotalCartAmount = () => {
    let total = 0;
    food_list.forEach((item) => {
      if (cartItems[item._id]) {
        total += item.price * cartItems[item._id];
      }
    });
    return total;
  };

  // ----------------------------
  // 🟢 Fetch Food List from Backend
  // ----------------------------
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.log("fetchFoodList error:", error);
    }
  };

  // ----------------------------
  // 🟢 On Component Mount
  // ----------------------------
  useEffect(() => {
    fetchFoodList();

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      loadCartData(savedToken);
    }
  }, []);

  // ----------------------------
  // 🟢 Context Provider
  // ----------------------------
  const contextValue = {
    url,
    token,
    setToken,
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart, // ✅ new function
    getTotalCartAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
