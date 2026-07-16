// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// // ==================== TYPES ====================

// interface Variant {
//   _id: string;
//   size?: string;
//   color?: string;
//   price: number;
//   discountPrice?: number;
//   image?: string;
//   stock?: number;
// }

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   discountPrice?: number;
//   images?: string[];
// }

// interface CartItem {
//   _id: string;
//   product: Product;
//   variant?: Variant;
//   quantity: number;
// }

// interface Address {
//   _id: string;
//   fullName: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
//   isDefault?: boolean;
// }

// interface NewAddress {
//   fullName: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
//   isDefault: boolean;
// }

// // ==================== HELPERS ====================

// const getUserId = () => {
//   if (typeof window !== "undefined") {
//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     if (user?.id) return user.id;
//     return localStorage.getItem("guestId") || "";
//   }
//   return "";
// };

// const getEffectivePrice = (item: CartItem): number => {
//   if (
//     item.variant?.discountPrice &&
//     item.variant.discountPrice < item.variant.price
//   ) {
//     return item.variant.discountPrice;
//   }
//   if (item.variant?.price) return item.variant.price;
//   if (
//     item.product?.discountPrice &&
//     item.product.discountPrice < item.product.price
//   ) {
//     return item.product.discountPrice;
//   }
//   return item.product?.price ?? 0;
// };

// const getOriginalPrice = (item: CartItem): number =>
//   item.variant?.price ?? item.product?.price ?? 0;

// const isOnSale = (item: CartItem): boolean =>
//   !!(
//     item.variant?.discountPrice &&
//     item.variant.discountPrice < item.variant.price
//   ) ||
//   !!(
//     item.product?.discountPrice &&
//     item.product.discountPrice < item.product.price
//   );

// // ==================== COMPONENT ====================

// const CheckoutPage = () => {
//   const router = useRouter();
//   const userId = getUserId();

//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddress, setSelectedAddress] = useState<string>("");
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [newAddress, setNewAddress] = useState<NewAddress>({
//     fullName: "",
//     phone: "",
//     address: "",
//     city: "",
//     country: "",
//     isDefault: false,
//   });
//   const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
//     "cash",
//   );
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const formatPrice = (price: number) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);

//   useEffect(() => {
//     // Bắt đăng nhập trước khi vào trang thanh toán
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login?redirect=/checkout");
//       return;
//     }

//     const fetchCart = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
//           {
//             credentials: "include",
//           },
//         );
//         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
//         const data = await res.json();
//         setCartItems(data.items || []);
//       } catch (err: unknown) {
//         setError(
//           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
//         );
//       }
//     };

//     const fetchAddresses = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             credentials: "include",
//           },
//         );
//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
//         }
//         const data: Address[] = await res.json();
//         setAddresses(data);
//         const defaultAddress = data.find((addr) => addr.isDefault);
//         if (defaultAddress) setSelectedAddress(defaultAddress._id);
//       } catch (err: unknown) {
//         setError(
//           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//     fetchAddresses();
//   }, [userId, router]);

//   const subtotal = cartItems.reduce(
//     (total, item) => total + getEffectivePrice(item) * item.quantity,
//     0,
//   );

//   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setNewAddress((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCheckout = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login?redirect=/checkout");
//       return;
//     }
//     if (!selectedAddress && !useNewAddress) {
//       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
//       return;
//     }
//     if (cartItems.length === 0) {
//       setError("Giỏ hàng trống.");
//       return;
//     }
//     if (
//       useNewAddress &&
//       (!newAddress.fullName ||
//         !newAddress.phone ||
//         !newAddress.address ||
//         !newAddress.city ||
//         !newAddress.country)
//     ) {
//       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         products: cartItems.map((item) => ({
//           product: item.product._id,
//           variant: item.variant?._id,
//           quantity: item.quantity,
//         })),
//         totalPrice: subtotal,
//         paymentMethod,
//         ...(useNewAddress
//           ? { newShippingAddress: newAddress }
//           : { shippingAddress: selectedAddress }),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.error || "Thanh toán thất bại");
//       }

//       const createdOrder = await res.json();

//       // Xóa giỏ hàng phía client (giỏ hàng thật đã được xử lý ở backend nếu có logic riêng)
//       window.dispatchEvent(new Event("cart-updated"));

//       router.push(`/order-confirmation?orderId=${createdOrder._id}`);
//     } catch (err: unknown) {
//       setError(
//         err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         Đang tải...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thanh toán</h1>

//         {/* Giỏ hàng */}
//         <div className="mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Giỏ hàng của bạn
//           </h2>
//           {cartItems.length === 0 ? (
//             <p className="text-gray-600">Giỏ hàng trống.</p>
//           ) : (
//             <div className="space-y-4">
//               {cartItems.map((item) => {
//                 const effectivePrice = getEffectivePrice(item);
//                 const originalPrice = getOriginalPrice(item);
//                 const onSale = isOnSale(item);

//                 return (
//                   <div
//                     key={item._id}
//                     className="flex items-center space-x-4 border-b pb-3"
//                   >
//                     <Image
//                       src={
//                         item.variant?.image ||
//                         item.product?.images?.[0] ||
//                         "/img/placeholder.jpg"
//                       }
//                       alt={item.product?.name || "Sản phẩm"}
//                       width={64}
//                       height={64}
//                       className="w-16 h-16 object-cover rounded"
//                     />
//                     <div className="flex-1">
//                       <div className="font-semibold">{item.product?.name}</div>
//                       {item.variant && (
//                         <div className="text-xs text-gray-500">
//                           Kích thước: {item.variant.size} / Màu sắc:{" "}
//                           {item.variant.color}
//                         </div>
//                       )}
//                       <div className="text-xs text-gray-500">
//                         Số lượng: {item.quantity}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {onSale ? (
//                           <div className="flex items-center space-x-2">
//                             <span className="text-red-500">
//                               {formatPrice(effectivePrice)}
//                             </span>
//                             <span className="line-through text-gray-400">
//                               {formatPrice(originalPrice)}
//                             </span>
//                           </div>
//                         ) : (
//                           <span>{formatPrice(effectivePrice)}</span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="font-semibold">
//                       {formatPrice(effectivePrice * item.quantity)}
//                     </div>
//                   </div>
//                 );
//               })}
//               <div className="flex justify-between font-semibold mt-4">
//                 <span>Tổng cộng</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Địa chỉ giao hàng */}
//         <div className="mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Địa chỉ giao hàng
//           </h2>
//           {addresses.length > 0 && (
//             <div className="mb-4">
//               <h3 className="text-sm font-medium mb-2">Chọn địa chỉ có sẵn:</h3>
//               {addresses.map((addr) => (
//                 <div key={addr._id} className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     name="address"
//                     value={addr._id}
//                     checked={selectedAddress === addr._id}
//                     onChange={() => {
//                       setSelectedAddress(addr._id);
//                       setUseNewAddress(false);
//                     }}
//                     className="mr-2"
//                   />
//                   <div>
//                     <p className="font-semibold">{addr.fullName}</p>
//                     <p>
//                       {addr.address}, {addr.city}, {addr.country}
//                     </p>
//                     <p>SĐT: {addr.phone}</p>
//                     {addr.isDefault && (
//                       <span className="text-green-600 text-xs">[Mặc định]</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mb-4">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={useNewAddress}
//                 onChange={() => setUseNewAddress(!useNewAddress)}
//                 className="mr-2"
//               />
//               Nhập địa chỉ mới
//             </label>
//           </div>

//           {useNewAddress && (
//             <div className="space-y-4">
//               {(
//                 ["fullName", "phone", "address", "city", "country"] as const
//               ).map((field) => (
//                 <input
//                   key={field}
//                   type="text"
//                   name={field}
//                   value={newAddress[field]}
//                   onChange={handleNewAddressChange}
//                   placeholder={
//                     {
//                       fullName: "Họ và tên",
//                       phone: "Số điện thoại",
//                       address: "Địa chỉ",
//                       city: "Thành phố",
//                       country: "Quốc gia",
//                     }[field]
//                   }
//                   className="w-full border rounded px-3 py-2"
//                 />
//               ))}
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isDefault"
//                   checked={newAddress.isDefault}
//                   onChange={handleNewAddressChange}
//                   className="mr-2"
//                 />
//                 Đặt làm địa chỉ mặc định
//               </label>
//             </div>
//           )}
//         </div>

//         {/* Phương thức thanh toán */}
//         <div className="mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Phương thức thanh toán
//           </h2>
//           <div className="flex items-center space-x-6">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="cash"
//                 checked={paymentMethod === "cash"}
//                 onChange={() => setPaymentMethod("cash")}
//                 className="mr-2"
//               />
//               Thanh toán khi nhận hàng (COD)
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="bank_transfer"
//                 checked={paymentMethod === "bank_transfer"}
//                 onChange={() => setPaymentMethod("bank_transfer")}
//                 className="mr-2"
//               />
//               Chuyển khoản ngân hàng
//             </label>
//           </div>
//         </div>

//         <form onSubmit={handleCheckout} className="space-y-4">
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={
//               submitting ||
//               cartItems.length === 0 ||
//               (!selectedAddress && !useNewAddress)
//             }
//           >
//             {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
//           </button>
//           {error && <p className="text-red-600 text-sm">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ==================== TYPES ====================

interface Variant {
  _id: string;
  size?: string;
  color?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  stock?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
}

interface CartItem {
  _id: string;
  product: Product;
  variant?: Variant;
  quantity: number;
}

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

interface NewAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
}

// ==================== HELPERS ====================

const getUserId = () => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.id) return user.id;
    return localStorage.getItem("guestId") || "";
  }
  return "";
};

const getEffectivePrice = (item: CartItem): number => {
  if (
    item.variant?.discountPrice &&
    item.variant.discountPrice < item.variant.price
  ) {
    return item.variant.discountPrice;
  }
  if (item.variant?.price) return item.variant.price;
  if (
    item.product?.discountPrice &&
    item.product.discountPrice < item.product.price
  ) {
    return item.product.discountPrice;
  }
  return item.product?.price ?? 0;
};

const getOriginalPrice = (item: CartItem): number =>
  item.variant?.price ?? item.product?.price ?? 0;

const isOnSale = (item: CartItem): boolean =>
  !!(
    item.variant?.discountPrice &&
    item.variant.discountPrice < item.variant.price
  ) ||
  !!(
    item.product?.discountPrice &&
    item.product.discountPrice < item.product.price
  );

// ==================== SMALL UI PRIMITIVES ====================

const StepBadge = ({ n }: { n: number }) => (
  <span className="checkout-step-badge">{n}</span>
);

// ==================== COMPONENT ====================

const CheckoutPage = () => {
  const router = useRouter();
  const userId = getUserId();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    isDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
    "cash",
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  useEffect(() => {
    // Bắt đăng nhập trước khi vào trang thanh toán
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Không thể tải giỏ hàng");
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
        );
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          },
        );
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
        }
        const data: Address[] = await res.json();
        setAddresses(data);
        const defaultAddress = data.find((addr) => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [userId, router]);

  const subtotal = cartItems.reduce(
    (total, item) => total + getEffectivePrice(item) * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce((n, item) => n + item.quantity, 0);
  const savings = cartItems.reduce((n, item) => {
    if (!isOnSale(item)) return n;
    return (
      n + (getOriginalPrice(item) - getEffectivePrice(item)) * item.quantity
    );
  }, 0);

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (!selectedAddress && !useNewAddress) {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }
    if (
      useNewAddress &&
      (!newAddress.fullName ||
        !newAddress.phone ||
        !newAddress.address ||
        !newAddress.city ||
        !newAddress.country)
    ) {
      setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          variant: item.variant?._id,
          quantity: item.quantity,
        })),
        totalPrice: subtotal,
        paymentMethod,
        ...(useNewAddress
          ? { newShippingAddress: newAddress }
          : { shippingAddress: selectedAddress }),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Thanh toán thất bại");
      }

      const createdOrder = await res.json();

      // Xóa giỏ hàng phía client (giỏ hàng thật đã được xử lý ở backend nếu có logic riêng)
      window.dispatchEvent(new Event("cart-updated"));

      router.push(`/order-confirmation?orderId=${createdOrder._id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !submitting && cartItems.length > 0 && (!!selectedAddress || useNewAddress);

  if (loading) {
    return (
      <div className="checkout-root min-h-screen flex justify-center items-center">
        <div className="flex items-center gap-3 text-[15px] text-[var(--muted)]">
          <span className="checkout-spinner" />
          Đang tải thông tin thanh toán...
        </div>
        <CheckoutStyles />
      </div>
    );
  }

  return (
    <div className="checkout-root min-h-screen pb-28 lg:pb-12">
      <CheckoutStyles />

      {/* Header / progress */}
      <div className="border-b border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur sticky top-0 z-20">
        <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-[var(--ink)]">
            Thanh toán
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--muted)] tracking-wide">
            <span className="text-[var(--ink)]">Giỏ hàng</span>
            <span className="checkout-dot" />
            <span className="text-[var(--ink)]">Giao hàng</span>
            <span className="checkout-dot" />
            <span>Xác nhận</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleCheckout}
        className="px-4 sm:px-8 md:px-16 lg:px-60 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start"
      >
        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6">
          {/* Step 1 — Giỏ hàng */}
          <section className="checkout-card">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge n={1} />
              <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
                Giỏ hàng của bạn
              </h2>
              {totalItems > 0 && (
                <span className="ml-auto text-xs text-[var(--muted)]">
                  {totalItems} sản phẩm
                </span>
              )}
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Giỏ hàng trống.</p>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {cartItems.map((item) => {
                  const effectivePrice = getEffectivePrice(item);
                  const originalPrice = getOriginalPrice(item);
                  const onSale = isOnSale(item);

                  return (
                    <li
                      key={item._id}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--paper)] shrink-0 ring-1 ring-[var(--line)]">
                        <Image
                          src={
                            item.variant?.image ||
                            item.product?.images?.[0] ||
                            "/img/placeholder.jpg"
                          }
                          alt={item.product?.name || "Sản phẩm"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--ink)] truncate">
                          {item.product?.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-[var(--muted)] mt-0.5">
                            {item.variant.size && `Size ${item.variant.size}`}
                            {item.variant.size && item.variant.color && " · "}
                            {item.variant.color && `Màu ${item.variant.color}`}
                          </p>
                        )}
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          SL: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-sm text-[var(--ink)]">
                          {formatPrice(effectivePrice * item.quantity)}
                        </div>
                        {onSale && (
                          <div className="text-xs mt-0.5 space-x-1.5">
                            <span className="line-through text-[var(--muted)]">
                              {formatPrice(originalPrice)}
                            </span>
                            <span className="text-[var(--sale)]">
                              {formatPrice(effectivePrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Step 2 — Địa chỉ giao hàng */}
          <section className="checkout-card">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge n={2} />
              <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
                Địa chỉ giao hàng
              </h2>
            </div>

            {addresses.length > 0 && (
              <div className="space-y-2.5 mb-4">
                {addresses.map((addr) => {
                  const checked =
                    selectedAddress === addr._id && !useNewAddress;
                  return (
                    <label
                      key={addr._id}
                      className={`checkout-option ${checked ? "checkout-option--active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={checked}
                        onChange={() => {
                          setSelectedAddress(addr._id);
                          setUseNewAddress(false);
                        }}
                        className="checkout-radio"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm text-[var(--ink)]">
                            {addr.fullName}
                          </p>
                          {addr.isDefault && (
                            <span className="checkout-tag">Mặc định</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {addr.address}, {addr.city}, {addr.country}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          SĐT: {addr.phone}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useNewAddress}
                onChange={() => setUseNewAddress(!useNewAddress)}
                className="checkout-checkbox"
              />
              Nhập địa chỉ mới
            </label>

            {useNewAddress && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  ["fullName", "phone", "address", "city", "country"] as const
                ).map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={newAddress[field]}
                    onChange={handleNewAddressChange}
                    placeholder={
                      {
                        fullName: "Họ và tên",
                        phone: "Số điện thoại",
                        address: "Địa chỉ",
                        city: "Thành phố",
                        country: "Quốc gia",
                      }[field]
                    }
                    className={`checkout-input ${
                      field === "address" ? "sm:col-span-2" : ""
                    }`}
                  />
                ))}
                <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none sm:col-span-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleNewAddressChange}
                    className="checkout-checkbox"
                  />
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            )}
          </section>

          {/* Step 3 — Phương thức thanh toán */}
          <section className="checkout-card">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge n={3} />
              <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
                Phương thức thanh toán
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`checkout-option ${
                  paymentMethod === "cash" ? "checkout-option--active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="checkout-radio"
                />
                <div>
                  <p className="font-medium text-sm text-[var(--ink)]">
                    Thanh toán khi nhận hàng
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">COD</p>
                </div>
              </label>
              <label
                className={`checkout-option ${
                  paymentMethod === "bank_transfer"
                    ? "checkout-option--active"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="checkout-radio"
                />
                <div>
                  <p className="font-medium text-sm text-[var(--ink)]">
                    Chuyển khoản ngân hàng
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Xác nhận thủ công
                  </p>
                </div>
              </label>
            </div>
          </section>

          {error && (
            <p className="text-sm text-[var(--sale)] bg-[var(--sale-soft)] border border-[var(--sale)]/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* ================= RIGHT COLUMN — RECEIPT SUMMARY ================= */}
        <aside className="lg:sticky lg:top-24">
          <div className="checkout-receipt">
            <p className="font-display text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-4">
              Tóm tắt đơn hàng
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span className="text-[var(--ink)]">
                  {formatPrice(subtotal + savings)}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-[var(--sale)]">
                  <span>Tiết kiệm</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--muted)]">
                <span>Phí vận chuyển</span>
                <span className="text-[var(--ink)]">Miễn phí</span>
              </div>
            </div>

            <div className="checkout-notches" />

            <div className="flex justify-between items-baseline">
              <span className="font-medium text-[var(--ink)]">Tổng cộng</span>
              <span className="font-display text-xl font-semibold text-[var(--ink)]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              type="submit"
              className="checkout-cta mt-5"
              disabled={!canSubmit}
            >
              {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>

            <p className="text-[11px] text-[var(--muted)] text-center mt-3 leading-relaxed">
              Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của chúng
              tôi.
            </p>
          </div>
        </aside>

        {/* Mobile sticky total bar */}
        <div className="checkout-mobile-bar lg:hidden">
          <div>
            <p className="text-[11px] text-[var(--muted)]">Tổng cộng</p>
            <p className="font-display text-base font-semibold text-[var(--ink)]">
              {formatPrice(subtotal)}
            </p>
          </div>
          <button
            type="submit"
            className="checkout-cta w-auto px-6"
            disabled={!canSubmit}
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================== STYLES ====================
// Scoped design tokens + the receipt-notch signature detail.
// For production, move the @import into next/font in your root layout
// instead of loading it per-page.

const CheckoutStyles = () => (
  <style jsx global>{`
    @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");

    .checkout-root {
      --paper: #f5f5f4;
      --surface: #ffffff;
      --ink: #111111;
      --muted: #6b6b6b;
      --line: #e2e2e0;
      --accent: #111111;
      --accent-soft: #ececea;
      --sale: #111111;
      --sale-soft: #ececea;
      --gold: #111111;
      background: var(--paper);
      font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
      color: var(--ink);
    }
    .checkout-root .font-display {
      font-family:
        "Be Vietnam Pro", "Inter", ui-sans-serif, system-ui, sans-serif;
    }

    .checkout-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 20px;
    }
    @media (min-width: 640px) {
      .checkout-card {
        padding: 24px 28px;
      }
    }

    .checkout-step-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-family: "Be Vietnam Pro", sans-serif;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }

    .checkout-dot {
      width: 3px;
      height: 3px;
      border-radius: 999px;
      background: var(--muted);
      display: inline-block;
    }

    .checkout-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 12px 14px;
      cursor: pointer;
      transition:
        border-color 0.15s ease,
        background-color 0.15s ease;
    }
    .checkout-option:hover {
      border-color: var(--accent);
    }
    .checkout-option--active {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .checkout-radio {
      margin-top: 2px;
      accent-color: var(--accent);
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .checkout-checkbox {
      accent-color: var(--accent);
      width: 16px;
      height: 16px;
    }

    .checkout-tag {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--ink);
      background: var(--accent-soft);
      border-radius: 999px;
      padding: 2px 8px;
    }

    .checkout-input {
      width: 100%;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 14px;
      color: var(--ink);
      outline: none;
      transition: border-color 0.15s ease;
    }
    .checkout-input:focus {
      border-color: var(--accent);
    }
    .checkout-input::placeholder {
      color: var(--muted);
    }

    /* Receipt-inspired order summary */
    .checkout-receipt {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 22px 24px 20px;
      box-shadow: 0 1px 2px rgba(22, 33, 27, 0.04);
    }

    .checkout-notches {
      height: 14px;
      margin: 14px -24px 12px;
      background-image: radial-gradient(
        circle at 10px 7px,
        var(--paper) 7px,
        transparent 7.5px
      );
      background-size: 20px 14px;
      background-repeat: repeat-x;
      background-position: center;
      border-top: 1px dashed var(--line);
      border-bottom: 1px dashed var(--line);
    }

    .checkout-cta {
      width: 100%;
      background: var(--accent);
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 18px;
      border-radius: 10px;
      transition:
        background-color 0.15s ease,
        opacity 0.15s ease;
    }
    .checkout-cta:hover:not(:disabled) {
      background: #000000;
    }
    .checkout-cta:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .checkout-mobile-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 30;
      background: var(--surface);
      border-top: 1px solid var(--line);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 -4px 16px rgba(22, 33, 27, 0.06);
    }

    .checkout-spinner {
      width: 16px;
      height: 16px;
      border-radius: 999px;
      border: 2px solid var(--line);
      border-top-color: var(--accent);
      animation: checkout-spin 0.7s linear infinite;
    }
    @keyframes checkout-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .checkout-spinner {
        animation: none;
      }
    }
  `}</style>
);

export default CheckoutPage;
