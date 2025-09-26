// redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product: any; // Thay bằng kiểu Product cụ thể
  variant: any | null; // Thay bằng kiểu Variant cụ thể
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const { product, variant, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.product._id === product._id &&
          (!variant || item.variant?._id === variant._id)
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, variant, quantity });
      }
    },
    refresh(state) {
      state.items = []; // Làm mới giỏ hàng sau khi hợp nhất
    },
  },
});

export const { addToCart, refresh } = cartSlice.actions;
export default cartSlice.reducer;