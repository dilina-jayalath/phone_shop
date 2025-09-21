import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  products: [],
  cartMessage: null,
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if the product has stock availability and quantity
      const { availability, qty } = action.payload;
      
      // Check if product is available and has stock
      const isAvailable = availability === "yes" || availability === "true" || availability === true;
      const hasStock = qty && parseInt(qty) > 0;
      
      if (!isAvailable || !hasStock) {
        // Don't add to cart if out of stock
        state.cartMessage = {
          type: 'error',
          text: 'This product is currently out of stock'
        };
        return;
      }
      
      const item = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        // Check if adding more would exceed available stock
        if (item.quantity + action.payload.quantity <= parseInt(qty)) {
          item.quantity += action.payload.quantity;
          state.cartMessage = {
            type: 'success',
            text: `Quantity updated! ${action.payload.name} quantity increased to ${item.quantity}`
          };
        } else {
          state.cartMessage = {
            type: 'warning',
            text: `Cannot add more! Maximum available quantity is ${qty}`
          };
        }
      } else {
        state.products.push(action.payload);
        state.cartMessage = {
          type: 'success',
          text: `${action.payload.name} added to cart successfully!`
        };
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        // Check if increasing would exceed available stock
        const maxQty = action.payload.maxQty || item.maxQty || 999; // Use provided max or default
        if (item.quantity < maxQty) {
          item.quantity++;
        }
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    clearCartMessage: (state) => {
      state.cartMessage = null;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  clearCartMessage,
} = orebiSlice.actions;
export default orebiSlice.reducer;
