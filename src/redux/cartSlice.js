import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      // Check if item with same id, size, and color already exists
      const existingItem = state.cartItems.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color
      );

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      const cart = state.cartItems.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      );
      state.cartItems = cart
    },
    
    updateCartItemQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.cartItems.find(
        (i) => i.id === id && i.size === size && i.color === color
      );
      if (item) {
        item.quantity = quantity;
      }
    },

    
    
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;