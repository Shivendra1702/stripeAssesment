import { createSlice } from "@reduxjs/toolkit";

const productCartSlice = createSlice({
  name: "productCart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const index = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index === -1) {
        state.cart.push({ ...action.payload, quantity: 1 });
      } else {
        state.cart[index].quantity += 1;
      }
    },
    removeFromCart: (state, action) => {
      const index = state.cart.findIndex((item) => item.id === action.payload);
      if (state.cart[index].quantity === 1) {
        state.cart = state.cart.filter((item) => item.id !== action.payload);
      } else {
        state.cart[index].quantity -= 1;
      }
    },
  },
});

export const { addToCart, removeFromCart } = productCartSlice.actions;
export default productCartSlice.reducer;
