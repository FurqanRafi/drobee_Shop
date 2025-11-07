"use client";
import { createSlice } from "@reduxjs/toolkit";

// ✅ Helper to get cart from localStorage
const getStoredCart = (userId) => {
  if (typeof window !== "undefined") {
    const key = userId ? `cart_${userId}` : "cart_guest";
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

// ✅ Helper to save cart to localStorage
const saveCart = (userId, cartItems) => {
  if (typeof window !== "undefined") {
    const key = userId ? `cart_${userId}` : "cart_guest";
    localStorage.setItem(key, JSON.stringify(cartItems));
  }
};

// ✅ Clear guest cart
const clearGuestCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart_guest");
  }
};

// ✅ Merge guest cart with user cart
const mergeGuestCart = (userCart, guestCart) => {
  const merged = [...userCart];

  guestCart.forEach((guestItem) => {
    const existingItem = merged.find(
      (item) =>
        item.id === guestItem.id &&
        item.size === guestItem.size &&
        item.color === guestItem.color
    );

    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      merged.push(guestItem);
    }
  });

  return merged;
};

const initialState = {
  cartItems: [],
  userId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Set user ID and load their cart
    setUserId: (state, action) => {
      state.userId = action.payload;
      if (action.payload) {
        state.cartItems = getStoredCart(action.payload);
      }
    },

    // ✅ Initialize cart on app load
    initializeCart: (state, action) => {
      const userId = action.payload;
      state.userId = userId;

      if (userId) {
        // ✅ Get guest cart
        const guestCart = getStoredCart(null);
        // ✅ Get user cart
        const userCart = getStoredCart(userId);

        // ✅ Merge guest cart with user cart
        const mergedCart = mergeGuestCart(userCart, guestCart);
        state.cartItems = mergedCart;

        // ✅ Save merged cart to user's localStorage
        saveCart(userId, mergedCart);

        // // ✅ Clear guest cart after merging
        // clearGuestCart();
      } else {
        // ✅ Load guest cart
        state.cartItems = getStoredCart(null);
      }
    },

    // ✅ Add to cart
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find(
        (i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
      );

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }

      // Save to localStorage (user or guest)
      saveCart(state.userId, state.cartItems);
    },

    // ✅ Remove from cart
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      );

      saveCart(state.userId, state.cartItems);
    },

    // ✅ Update quantity
    updateCartItemQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.cartItems.find(
        (i) => i.id === id && i.size === size && i.color === color
      );

      if (item) {
        item.quantity = quantity;
      }

      saveCart(state.userId, state.cartItems);
    },

    // ✅ Set entire cart (for login restore)
    setCart: (state, action) => {
      state.cartItems = action.payload || [];
      saveCart(state.userId, state.cartItems);
    },

    // ✅ Clear cart
    clearCart: (state) => {
      state.cartItems = [];
      saveCart(state.userId, []);
    },

    // ✅ Logout: Clear guest cart and reset to guest mode
    logoutCart: (state) => {
      state.userId = null;
      state.cartItems = JSON.parse(localStorage.getItem("cart_guest")) || [];
    },
  },
});

export const {
  setUserId,
  initializeCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  setCart,
  clearCart,
  logoutCart,
} = cartSlice.actions;

export default cartSlice.reducer;
