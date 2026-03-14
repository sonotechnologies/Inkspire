import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { api, useAuth } from "./AuthContext";

const CartContext = createContext();

const SHIPPING_FEE = 1500;

export const CartProvider = ({ children }) => {
  const { user, loading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  /*
  =========================
  AXIOS INSTANCE
  =========================
  */

  /*
  =========================
  LOAD CART FROM DATABASE
  =========================
  */

  const loadCart = async () => {

  if (!user) {
    setCartItems([]);
    setCartLoading(false);
    return;
  }

  try {

    setCartLoading(true);

    const res = await api.get(`/cart/${user.id}`);

    const formatted = res.data.map((item) => ({
      ...item.book,
      quantity: item.quantity,
      cartItemId: item.id
    }));

    setCartItems(formatted);

  } catch (err) {

    console.error("Failed to load cart", err);

  } finally {

    setCartLoading(false);

  }
};

  useEffect(() => {
    if (loading) return;

    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user, loading]);

  /*
  =========================
  ADD TO CART
  =========================
  */

  const addToCart = async (book) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    console.log("BOOK ID:", book.id);
  console.log("USER ID:", user.id);

    try {
      await api.post("/cart/add", {
        // userId: user.id,
        bookId: Number(book.id),
      });

      await loadCart();
    } catch (err) {
      console.error("Failed to add item", err.response?.data);
    }
  };

  /*
  =========================
  REMOVE ITEM
  =========================
  */

  const removeFromCart = async (cartItemId) => {
    if (!user) return;

    // optimistic UI update
    setCartItems((prev) =>
      prev.filter((item) => item.cartItemId !== cartItemId),
    );

    try {
      await api.delete(`/cart/remove/${cartItemId}`);
    } catch (err) {
      console.error("Failed to remove item", err);

      loadCart();
    }
  };

  /*
  =========================
  UPDATE QUANTITY
  =========================
  */

  const updateQuantity = async (cartItemId, quantity) => {
    if (!user || quantity <= 0) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item,
      ),
    );

    try {
      await api.put(`/cart/update/${cartItemId}`, {
        quantity,
      });
    } catch (err) {
      console.error("Quantity update failed");

      loadCart();
    }
  };

  /*
  =========================
  CLEAR CART
  =========================
  */

  const clearCart = async () => {
    if (!user) return;

    try {
      await api.delete(`/cart/clear/${user.id}`);

      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  /*
  =========================
  CART CALCULATIONS
  =========================
  */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
      0,
    );
  }, [cartItems]);

  const hasPhysical = useMemo(() => {
    return cartItems.some((item) => item.format === "physical");
  }, [cartItems]);

  const shipping = hasPhysical ? SHIPPING_FEE : 0;

  const total = subtotal + shipping;

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isCartEmpty = cartItems.length === 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        total,
        itemCount,
        isCartEmpty,
        reloadCart: loadCart,
        cartLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/*
=========================
CUSTOM HOOK
=========================
*/

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
