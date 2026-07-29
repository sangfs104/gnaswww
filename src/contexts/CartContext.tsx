// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";

// interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     images: string[];
//   };
//   variant?: {
//     _id: string;
//     size: string;
//     color: string;
//     price: number;
//     image: string;
//   };
//   quantity: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
//   fetchCart: () => Promise<void>;
//   // Có thể thêm sau: addToCart, removeFromCart, updateQuantity...
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const getUserId = useCallback((): string => {
//     if (typeof window === "undefined") return "";

//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     if (user?.id) return user.id;

//     return localStorage.getItem("guestId") || "";
//   }, []);

//   const userId = getUserId();

//   const fetchCart = useCallback(async () => {
//     if (!userId) {
//       setCartItems([]);
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
//         {
//           credentials: "include",
//         },
//       );

//       if (!res.ok) throw new Error("Không thể tải giỏ hàng");

//       const data = await res.json();
//       setCartItems(data.items || []);
//     } catch (err) {
//       console.error("Fetch cart error:", err);
//       setCartItems([]);
//     }
//   }, [userId]);

//   // Fetch cart khi userId thay đổi
//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   return (
//     <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// ⚠️ Chỉnh lại đường dẫn cho khớp vị trí thật của file auth.ts trong project bạn
import { getUser, getGuestId } from "../lib/auth";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  variant?: {
    _id: string;
    size: string;
    color: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Dùng chung 1 nguồn lấy userId với ShoppingCart.tsx và CheckoutPage
  const getUserId = useCallback((): string => {
    if (typeof window === "undefined") return "";
    const user = getUser();
    if (user?.id) return user.id;
    return getGuestId() || "";
  }, []);

  const userId = getUserId();

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
        {
          credentials: "include",
          cache: "no-store", // ✅ luôn lấy dữ liệu mới nhất, tránh browser cache
        },
      );

      if (!res.ok) throw new Error("Không thể tải giỏ hàng");

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCartItems([]);
    }
  }, [userId]);

  // Fetch cart khi userId thay đổi
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ Tự động refetch mỗi khi có nơi khác báo "cart-updated"
  // (ví dụ: sau khi xóa/sửa sản phẩm ở trang giỏ hàng)
  useEffect(() => {
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
