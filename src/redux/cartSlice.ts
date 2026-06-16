// // redux/cartSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface CartItem {
//   product: any; // Thay bằng kiểu Product cụ thể
//   variant: any | null; // Thay bằng kiểu Variant cụ thể
//   quantity: number;
// }

// interface CartState {
//   items: CartItem[];
// }

// const initialState: CartState = {
//   items: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action: PayloadAction<CartItem>) {
//       const { product, variant, quantity } = action.payload;
//       const existingItem = state.items.find(
//         (item) =>
//           item.product._id === product._id &&
//           (!variant || item.variant?._id === variant._id)
//       );
//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         state.items.push({ product, variant, quantity });
//       }
//     },
//     refresh(state) {
//       state.items = []; // Làm mới giỏ hàng sau khi hợp nhất
//     },
//   },
// });

// export const { addToCart, refresh } = cartSlice.actions;
// export default cartSlice.reducer;
// redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   images: string[];
//   // Thêm các trường khác nếu cần
//   slug?: string;
//   category?: string;
// }
interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];  // ← thêm dấu ?
  slug?: string;
  category?: string;
}
interface Variant {
  _id: string;
  size?: string;
  color?: string;
  price: number;
  image?: string;
  stock?: number;
  // Thêm các trường khác nếu cần
}

interface CartItem {
  product: Product;
  variant: Variant | null;
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
      state.items = [];
    },

    // Có thể thêm reducer khác sau này
    removeFromCart(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.product._id === productId && 
            (!variantId || item.variant?._id === variantId))
      );
    },
  },
});

export const { addToCart, refresh, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;