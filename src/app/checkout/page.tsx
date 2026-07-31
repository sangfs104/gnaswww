// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import Image from "next/image";
// // // import {
// // //   getToken,
// // //   getUser,
// // //   getGuestId,
// // //   clearAuth,
// // // } from "../../../src/lib/auth";

// // // // ==================== TYPES ====================

// // // interface Variant {
// // //   _id: string;
// // //   size?: string;
// // //   color?: string;
// // //   price: number;
// // //   discountPrice?: number;
// // //   image?: string;
// // //   stock?: number;
// // // }

// // // interface Product {
// // //   _id: string;
// // //   name: string;
// // //   price: number;
// // //   discountPrice?: number;
// // //   images?: string[];
// // // }

// // // interface CartItem {
// // //   _id: string;
// // //   product: Product;
// // //   variant?: Variant;
// // //   quantity: number;
// // // }

// // // interface Address {
// // //   _id: string;
// // //   fullName: string;
// // //   phone: string;
// // //   address: string;
// // //   city: string;
// // //   country: string;
// // //   isDefault?: boolean;
// // // }

// // // interface NewAddress {
// // //   fullName: string;
// // //   phone: string;
// // //   address: string;
// // //   city: string;
// // //   country: string;
// // //   isDefault: boolean;
// // // }

// // // // ==================== HELPERS ====================

// // // const getUserId = () => {
// // //   const authUser = getUser();
// // //   if (authUser?.id) return authUser.id;
// // //   return getGuestId();
// // // };

// // // const getEffectivePrice = (item: CartItem): number => {
// // //   if (
// // //     item.variant?.discountPrice &&
// // //     item.variant.discountPrice < item.variant.price
// // //   ) {
// // //     return item.variant.discountPrice;
// // //   }
// // //   if (item.variant?.price) return item.variant.price;
// // //   if (
// // //     item.product?.discountPrice &&
// // //     item.product.discountPrice < item.product.price
// // //   ) {
// // //     return item.product.discountPrice;
// // //   }
// // //   return item.product?.price ?? 0;
// // // };

// // // const getOriginalPrice = (item: CartItem): number =>
// // //   item.variant?.price ?? item.product?.price ?? 0;

// // // const isOnSale = (item: CartItem): boolean =>
// // //   !!(
// // //     item.variant?.discountPrice &&
// // //     item.variant.discountPrice < item.variant.price
// // //   ) ||
// // //   !!(
// // //     item.product?.discountPrice &&
// // //     item.product.discountPrice < item.product.price
// // //   );

// // // // ==================== SMALL UI PRIMITIVES ====================

// // // const StepBadge = ({ n }: { n: number }) => (
// // //   <span className="checkout-step-badge">{n}</span>
// // // );

// // // // ==================== COMPONENT ====================

// // // const CheckoutPage = () => {
// // //   const router = useRouter();
// // //   const userId = getUserId();

// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// // //   const [addresses, setAddresses] = useState<Address[]>([]);
// // //   const [selectedAddress, setSelectedAddress] = useState<string>("");
// // //   const [useNewAddress, setUseNewAddress] = useState(false);
// // //   const [newAddress, setNewAddress] = useState<NewAddress>({
// // //     fullName: "",
// // //     phone: "",
// // //     address: "",
// // //     city: "",
// // //     country: "",
// // //     isDefault: false,
// // //   });
// // //   const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
// // //     "cash",
// // //   );
// // //   const [loading, setLoading] = useState(true);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const formatPrice = (price: number) =>
// // //     new Intl.NumberFormat("vi-VN", {
// // //       style: "currency",
// // //       currency: "VND",
// // //     }).format(price);

// // //   const redirectToLogin = () => {
// // //     clearAuth();
// // //     router.push("/login?redirect=/checkout");
// // //   };

// // //   // ✅ Tách fetchCart ra ngoài để có thể tái sử dụng (mount, event, trước khi submit)
// // //   const fetchCart = async () => {
// // //     try {
// // //       const res = await fetch(
// // //         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
// // //         {
// // //           credentials: "include",
// // //           cache: "no-store", // ✅ luôn lấy dữ liệu mới nhất từ server
// // //         },
// // //       );
// // //       if (res.status === 401) {
// // //         redirectToLogin();
// // //         return [];
// // //       }
// // //       if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// // //       const data = await res.json();
// // //       const items: CartItem[] = data.items || [];
// // //       setCartItems(items);
// // //       return items;
// // //     } catch (err: unknown) {
// // //       setError(
// // //         err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
// // //       );
// // //       return [];
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const token = getToken();
// // //     if (!token) {
// // //       redirectToLogin();
// // //       return;
// // //     }

// // //     const fetchAddresses = async () => {
// // //       try {
// // //         const res = await fetch(
// // //           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
// // //           {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //             credentials: "include",
// // //           },
// // //         );
// // //         if (res.status === 401) {
// // //           redirectToLogin();
// // //           return;
// // //         }
// // //         if (!res.ok) {
// // //           const errorData = await res.json().catch(() => ({}));
// // //           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
// // //         }
// // //         const data: Address[] = await res.json();
// // //         setAddresses(data);
// // //         const defaultAddress = data.find((addr) => addr.isDefault);
// // //         if (defaultAddress) setSelectedAddress(defaultAddress._id);
// // //       } catch (err: unknown) {
// // //         setError(
// // //           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
// // //         );
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCart();
// // //     fetchAddresses();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [userId, router]);

// // //   // ✅ Nếu ở trang giỏ hàng bạn vừa xóa sản phẩm rồi bấm "Thanh toán" ngay,
// // //   // event này đảm bảo trang Checkout tự cập nhật lại đúng giỏ hàng mới nhất
// // //   useEffect(() => {
// // //     window.addEventListener("cart-updated", fetchCart);
// // //     return () => window.removeEventListener("cart-updated", fetchCart);
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [userId]);

// // //   const subtotal = cartItems.reduce(
// // //     (total, item) => total + getEffectivePrice(item) * item.quantity,
// // //     0,
// // //   );
// // //   const totalItems = cartItems.reduce((n, item) => n + item.quantity, 0);
// // //   const savings = cartItems.reduce((n, item) => {
// // //     if (!isOnSale(item)) return n;
// // //     return (
// // //       n + (getOriginalPrice(item) - getEffectivePrice(item)) * item.quantity
// // //     );
// // //   }, 0);

// // //   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setNewAddress((prev) => ({
// // //       ...prev,
// // //       [name]: type === "checkbox" ? checked : value,
// // //     }));
// // //   };

// // //   const handleCheckout = async (e: React.FormEvent) => {
// // //     e.preventDefault();

// // //     const token = getToken();
// // //     if (!token) {
// // //       redirectToLogin();
// // //       return;
// // //     }
// // //     if (!selectedAddress && !useNewAddress) {
// // //       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
// // //       return;
// // //     }
// // //     if (
// // //       useNewAddress &&
// // //       (!newAddress.fullName ||
// // //         !newAddress.phone ||
// // //         !newAddress.address ||
// // //         !newAddress.city ||
// // //         !newAddress.country)
// // //     ) {
// // //       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
// // //       return;
// // //     }

// // //     setSubmitting(true);
// // //     setError(null);

// // //     try {
// // //       // ✅ QUAN TRỌNG: refetch giỏ hàng ngay trước khi submit, không dùng
// // //       // "cartItems" cũ trong state/closure — đảm bảo sản phẩm đã bị xóa
// // //       // trước đó chắc chắn không được gửi lên server nữa.
// // //       const freshItems = await fetchCart();

// // //       if (freshItems.length === 0) {
// // //         setError("Giỏ hàng trống.");
// // //         setSubmitting(false);
// // //         return;
// // //       }

// // //       const freshSubtotal = freshItems.reduce(
// // //         (total, item) => total + getEffectivePrice(item) * item.quantity,
// // //         0,
// // //       );

// // //       const payload = {
// // //         products: freshItems.map((item) => ({
// // //           product: item.product._id,
// // //           variant: item.variant?._id,
// // //           quantity: item.quantity,
// // //         })),
// // //         totalPrice: freshSubtotal,
// // //         paymentMethod,
// // //         ...(useNewAddress
// // //           ? { newShippingAddress: newAddress }
// // //           : { shippingAddress: selectedAddress }),
// // //       };

// // //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         credentials: "include",
// // //         body: JSON.stringify(payload),
// // //       });

// // //       if (res.status === 401) {
// // //         redirectToLogin();
// // //         return;
// // //       }
// // //       if (!res.ok) {
// // //         const errorData = await res.json().catch(() => ({}));
// // //         throw new Error(errorData.error || "Thanh toán thất bại");
// // //       }

// // //       const createdOrder = await res.json();

// // //       // ✅ Xóa sạch giỏ hàng phía client ngay sau khi đặt hàng thành công,
// // //       // để nếu user quay lại trang giỏ hàng/checkout sẽ không thấy sản phẩm cũ
// // //       setCartItems([]);
// // //       window.dispatchEvent(new Event("cart-updated"));

// // //       router.push(`/order-confirmation?orderId=${createdOrder._id}`);
// // //     } catch (err: unknown) {
// // //       setError(
// // //         err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
// // //       );
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const canSubmit =
// // //     !submitting && cartItems.length > 0 && (!!selectedAddress || useNewAddress);

// // //   if (loading) {
// // //     return (
// // //       <div className="checkout-root min-h-screen flex justify-center items-center">
// // //         <div className="flex items-center gap-3 text-[15px] text-[var(--muted)]">
// // //           <span className="checkout-spinner" />
// // //           Đang tải thông tin thanh toán...
// // //         </div>
// // //         <CheckoutStyles />
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="checkout-root min-h-screen pb-28 lg:pb-12">
// // //       <CheckoutStyles />

// // //       {/* Header / progress */}
// // //       <div className="border-b border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur sticky top-0 z-20">
// // //         <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 flex items-center justify-between">
// // //           <h1 className="font-display text-xl sm:text-2xl font-semibold text-[var(--ink)]">
// // //             Thanh toán
// // //           </h1>
// // //           <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--muted)] tracking-wide">
// // //             <span className="text-[var(--ink)]">Giỏ hàng</span>
// // //             <span className="checkout-dot" />
// // //             <span className="text-[var(--ink)]">Giao hàng</span>
// // //             <span className="checkout-dot" />
// // //             <span>Xác nhận</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <form
// // //         onSubmit={handleCheckout}
// // //         className="px-4 sm:px-8 md:px-16 lg:px-60 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start"
// // //       >
// // //         {/* ================= LEFT COLUMN ================= */}
// // //         <div className="space-y-6">
// // //           {/* Step 1 — Giỏ hàng */}
// // //           <section className="checkout-card">
// // //             <div className="flex items-center gap-3 mb-5">
// // //               <StepBadge n={1} />
// // //               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
// // //                 Giỏ hàng của bạn
// // //               </h2>
// // //               {totalItems > 0 && (
// // //                 <span className="ml-auto text-xs text-[var(--muted)]">
// // //                   {totalItems} sản phẩm
// // //                 </span>
// // //               )}
// // //             </div>

// // //             {cartItems.length === 0 ? (
// // //               <p className="text-sm text-[var(--muted)]">Giỏ hàng trống.</p>
// // //             ) : (
// // //               <ul className="divide-y divide-[var(--line)]">
// // //                 {cartItems.map((item) => {
// // //                   const effectivePrice = getEffectivePrice(item);
// // //                   const originalPrice = getOriginalPrice(item);
// // //                   const onSale = isOnSale(item);

// // //                   return (
// // //                     <li
// // //                       key={item._id}
// // //                       className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
// // //                     >
// // //                       <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--paper)] shrink-0 ring-1 ring-[var(--line)]">
// // //                         <Image
// // //                           src={
// // //                             item.variant?.image ||
// // //                             item.product?.images?.[0] ||
// // //                             "/img/placeholder.jpg"
// // //                           }
// // //                           alt={item.product?.name || "Sản phẩm"}
// // //                           fill
// // //                           className="object-cover"
// // //                         />
// // //                       </div>
// // //                       <div className="flex-1 min-w-0">
// // //                         <p className="font-medium text-sm text-[var(--ink)] truncate">
// // //                           {item.product?.name}
// // //                         </p>
// // //                         {item.variant && (
// // //                           <p className="text-xs text-[var(--muted)] mt-0.5">
// // //                             {item.variant.size && `Size ${item.variant.size}`}
// // //                             {item.variant.size && item.variant.color && " · "}
// // //                             {item.variant.color && `Màu ${item.variant.color}`}
// // //                           </p>
// // //                         )}
// // //                         <p className="text-xs text-[var(--muted)] mt-0.5">
// // //                           SL: {item.quantity}
// // //                         </p>
// // //                       </div>
// // //                       <div className="text-right shrink-0">
// // //                         <div className="font-semibold text-sm text-[var(--ink)]">
// // //                           {formatPrice(effectivePrice * item.quantity)}
// // //                         </div>
// // //                         {onSale && (
// // //                           <div className="text-xs mt-0.5 space-x-1.5">
// // //                             <span className="line-through text-[var(--muted)]">
// // //                               {formatPrice(originalPrice)}
// // //                             </span>
// // //                             <span className="text-[var(--sale)]">
// // //                               {formatPrice(effectivePrice)}
// // //                             </span>
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </li>
// // //                   );
// // //                 })}
// // //               </ul>
// // //             )}
// // //           </section>

// // //           {/* Step 2 — Địa chỉ giao hàng */}
// // //           <section className="checkout-card">
// // //             <div className="flex items-center gap-3 mb-5">
// // //               <StepBadge n={2} />
// // //               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
// // //                 Địa chỉ giao hàng
// // //               </h2>
// // //             </div>

// // //             {addresses.length > 0 && (
// // //               <div className="space-y-2.5 mb-4">
// // //                 {addresses.map((addr) => {
// // //                   const checked =
// // //                     selectedAddress === addr._id && !useNewAddress;
// // //                   return (
// // //                     <label
// // //                       key={addr._id}
// // //                       className={`checkout-option ${checked ? "checkout-option--active" : ""}`}
// // //                     >
// // //                       <input
// // //                         type="radio"
// // //                         name="address"
// // //                         value={addr._id}
// // //                         checked={checked}
// // //                         onChange={() => {
// // //                           setSelectedAddress(addr._id);
// // //                           setUseNewAddress(false);
// // //                         }}
// // //                         className="checkout-radio"
// // //                       />
// // //                       <div className="min-w-0">
// // //                         <div className="flex items-center gap-2 flex-wrap">
// // //                           <p className="font-medium text-sm text-[var(--ink)]">
// // //                             {addr.fullName}
// // //                           </p>
// // //                           {addr.isDefault && (
// // //                             <span className="checkout-tag">Mặc định</span>
// // //                           )}
// // //                         </div>
// // //                         <p className="text-xs text-[var(--muted)] mt-0.5">
// // //                           {addr.address}, {addr.city}, {addr.country}
// // //                         </p>
// // //                         <p className="text-xs text-[var(--muted)]">
// // //                           SĐT: {addr.phone}
// // //                         </p>
// // //                       </div>
// // //                     </label>
// // //                   );
// // //                 })}
// // //               </div>
// // //             )}

// // //             <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none">
// // //               <input
// // //                 type="checkbox"
// // //                 checked={useNewAddress}
// // //                 onChange={() => setUseNewAddress(!useNewAddress)}
// // //                 className="checkout-checkbox"
// // //               />
// // //               Nhập địa chỉ mới
// // //             </label>

// // //             {useNewAddress && (
// // //               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
// // //                 {(
// // //                   ["fullName", "phone", "address", "city", "country"] as const
// // //                 ).map((field) => (
// // //                   <input
// // //                     key={field}
// // //                     type="text"
// // //                     name={field}
// // //                     value={newAddress[field]}
// // //                     onChange={handleNewAddressChange}
// // //                     placeholder={
// // //                       {
// // //                         fullName: "Họ và tên",
// // //                         phone: "Số điện thoại",
// // //                         address: "Địa chỉ",
// // //                         city: "Thành phố",
// // //                         country: "Quốc gia",
// // //                       }[field]
// // //                     }
// // //                     className={`checkout-input ${
// // //                       field === "address" ? "sm:col-span-2" : ""
// // //                     }`}
// // //                   />
// // //                 ))}
// // //                 <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none sm:col-span-2">
// // //                   <input
// // //                     type="checkbox"
// // //                     name="isDefault"
// // //                     checked={newAddress.isDefault}
// // //                     onChange={handleNewAddressChange}
// // //                     className="checkout-checkbox"
// // //                   />
// // //                   Đặt làm địa chỉ mặc định
// // //                 </label>
// // //               </div>
// // //             )}
// // //           </section>

// // //           {/* Step 3 — Phương thức thanh toán */}
// // //           <section className="checkout-card">
// // //             <div className="flex items-center gap-3 mb-5">
// // //               <StepBadge n={3} />
// // //               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
// // //                 Phương thức thanh toán
// // //               </h2>
// // //             </div>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
// // //               <label
// // //                 className={`checkout-option ${
// // //                   paymentMethod === "cash" ? "checkout-option--active" : ""
// // //                 }`}
// // //               >
// // //                 <input
// // //                   type="radio"
// // //                   name="paymentMethod"
// // //                   value="cash"
// // //                   checked={paymentMethod === "cash"}
// // //                   onChange={() => setPaymentMethod("cash")}
// // //                   className="checkout-radio"
// // //                 />
// // //                 <div>
// // //                   <p className="font-medium text-sm text-[var(--ink)]">
// // //                     Thanh toán khi nhận hàng
// // //                   </p>
// // //                   <p className="text-xs text-[var(--muted)] mt-0.5">COD</p>
// // //                 </div>
// // //               </label>
// // //               <label
// // //                 className={`checkout-option ${
// // //                   paymentMethod === "bank_transfer"
// // //                     ? "checkout-option--active"
// // //                     : ""
// // //                 }`}
// // //               >
// // //                 <input
// // //                   type="radio"
// // //                   name="paymentMethod"
// // //                   value="bank_transfer"
// // //                   checked={paymentMethod === "bank_transfer"}
// // //                   onChange={() => setPaymentMethod("bank_transfer")}
// // //                   className="checkout-radio"
// // //                 />
// // //                 <div>
// // //                   <p className="font-medium text-sm text-[var(--ink)]">
// // //                     Chuyển khoản ngân hàng
// // //                   </p>
// // //                   <p className="text-xs text-[var(--muted)] mt-0.5">
// // //                     Xác nhận thủ công
// // //                   </p>
// // //                 </div>
// // //               </label>
// // //             </div>
// // //           </section>

// // //           {error && (
// // //             <p className="text-sm text-[var(--sale)] bg-[var(--sale-soft)] border border-[var(--sale)]/20 rounded-lg px-4 py-3">
// // //               {error}
// // //             </p>
// // //           )}
// // //         </div>

// // //         {/* ================= RIGHT COLUMN — RECEIPT SUMMARY ================= */}
// // //         <aside className="lg:sticky lg:top-24">
// // //           <div className="checkout-receipt">
// // //             <p className="font-display text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-4">
// // //               Tóm tắt đơn hàng
// // //             </p>

// // //             <div className="space-y-2 text-sm">
// // //               <div className="flex justify-between text-[var(--muted)]">
// // //                 <span>Tạm tính ({totalItems} sản phẩm)</span>
// // //                 <span className="text-[var(--ink)]">
// // //                   {formatPrice(subtotal + savings)}
// // //                 </span>
// // //               </div>
// // //               {savings > 0 && (
// // //                 <div className="flex justify-between text-[var(--sale)]">
// // //                   <span>Tiết kiệm</span>
// // //                   <span>-{formatPrice(savings)}</span>
// // //                 </div>
// // //               )}
// // //               <div className="flex justify-between text-[var(--muted)]">
// // //                 <span>Phí vận chuyển</span>
// // //                 <span className="text-[var(--ink)]">Miễn phí</span>
// // //               </div>
// // //             </div>

// // //             <div className="checkout-notches" />

// // //             <div className="flex justify-between items-baseline">
// // //               <span className="font-medium text-[var(--ink)]">Tổng cộng</span>
// // //               <span className="font-display text-xl font-semibold text-[var(--ink)]">
// // //                 {formatPrice(subtotal)}
// // //               </span>
// // //             </div>

// // //             <button
// // //               type="submit"
// // //               className="checkout-cta mt-5"
// // //               disabled={!canSubmit}
// // //             >
// // //               {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
// // //             </button>

// // //             <p className="text-[11px] text-[var(--muted)] text-center mt-3 leading-relaxed">
// // //               Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của chúng
// // //               tôi.
// // //             </p>
// // //           </div>
// // //         </aside>

// // //         {/* Mobile sticky total bar */}
// // //         <div className="checkout-mobile-bar lg:hidden">
// // //           <div>
// // //             <p className="text-[11px] text-[var(--muted)]">Tổng cộng</p>
// // //             <p className="font-display text-base font-semibold text-[var(--ink)]">
// // //               {formatPrice(subtotal)}
// // //             </p>
// // //           </div>
// // //           <button
// // //             type="submit"
// // //             className="checkout-cta w-auto px-6"
// // //             disabled={!canSubmit}
// // //           >
// // //             {submitting ? "Đang xử lý..." : "Đặt hàng"}
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // // ==================== STYLES ====================

// // // const CheckoutStyles = () => (
// // //   <style jsx global>{`
// // //     @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");

// // //     .checkout-root {
// // //       --paper: #f5f5f4;
// // //       --surface: #ffffff;
// // //       --ink: #111111;
// // //       --muted: #6b6b6b;
// // //       --line: #e2e2e0;
// // //       --accent: #111111;
// // //       --accent-soft: #ececea;
// // //       --sale: #111111;
// // //       --sale-soft: #ececea;
// // //       --gold: #111111;
// // //       background: var(--paper);
// // //       font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
// // //       color: var(--ink);
// // //     }
// // //     .checkout-root .font-display {
// // //       font-family:
// // //         "Be Vietnam Pro", "Inter", ui-sans-serif, system-ui, sans-serif;
// // //     }

// // //     .checkout-card {
// // //       background: var(--surface);
// // //       border: 1px solid var(--line);
// // //       border-radius: 16px;
// // //       padding: 20px;
// // //     }
// // //     @media (min-width: 640px) {
// // //       .checkout-card {
// // //         padding: 24px 28px;
// // //       }
// // //     }

// // //     .checkout-step-badge {
// // //       display: inline-flex;
// // //       align-items: center;
// // //       justify-content: center;
// // //       width: 26px;
// // //       height: 26px;
// // //       border-radius: 999px;
// // //       background: var(--accent-soft);
// // //       color: var(--accent);
// // //       font-family: "Be Vietnam Pro", sans-serif;
// // //       font-weight: 700;
// // //       font-size: 12px;
// // //       flex-shrink: 0;
// // //     }

// // //     .checkout-dot {
// // //       width: 3px;
// // //       height: 3px;
// // //       border-radius: 999px;
// // //       background: var(--muted);
// // //       display: inline-block;
// // //     }

// // //     .checkout-option {
// // //       display: flex;
// // //       align-items: flex-start;
// // //       gap: 12px;
// // //       border: 1px solid var(--line);
// // //       border-radius: 12px;
// // //       padding: 12px 14px;
// // //       cursor: pointer;
// // //       transition:
// // //         border-color 0.15s ease,
// // //         background-color 0.15s ease;
// // //     }
// // //     .checkout-option:hover {
// // //       border-color: var(--accent);
// // //     }
// // //     .checkout-option--active {
// // //       border-color: var(--accent);
// // //       background: var(--accent-soft);
// // //     }

// // //     .checkout-radio {
// // //       margin-top: 2px;
// // //       accent-color: var(--accent);
// // //       width: 16px;
// // //       height: 16px;
// // //       flex-shrink: 0;
// // //     }
// // //     .checkout-checkbox {
// // //       accent-color: var(--accent);
// // //       width: 16px;
// // //       height: 16px;
// // //     }

// // //     .checkout-tag {
// // //       font-size: 10px;
// // //       font-weight: 600;
// // //       letter-spacing: 0.02em;
// // //       color: var(--ink);
// // //       background: var(--accent-soft);
// // //       border-radius: 999px;
// // //       padding: 2px 8px;
// // //     }

// // //     .checkout-input {
// // //       width: 100%;
// // //       border: 1px solid var(--line);
// // //       background: var(--surface);
// // //       border-radius: 10px;
// // //       padding: 10px 14px;
// // //       font-size: 14px;
// // //       color: var(--ink);
// // //       outline: none;
// // //       transition: border-color 0.15s ease;
// // //     }
// // //     .checkout-input:focus {
// // //       border-color: var(--accent);
// // //     }
// // //     .checkout-input::placeholder {
// // //       color: var(--muted);
// // //     }

// // //     .checkout-receipt {
// // //       background: var(--surface);
// // //       border: 1px solid var(--line);
// // //       border-radius: 16px;
// // //       padding: 22px 24px 20px;
// // //       box-shadow: 0 1px 2px rgba(22, 33, 27, 0.04);
// // //     }

// // //     .checkout-notches {
// // //       height: 14px;
// // //       margin: 14px -24px 12px;
// // //       background-image: radial-gradient(
// // //         circle at 10px 7px,
// // //         var(--paper) 7px,
// // //         transparent 7.5px
// // //       );
// // //       background-size: 20px 14px;
// // //       background-repeat: repeat-x;
// // //       background-position: center;
// // //       border-top: 1px dashed var(--line);
// // //       border-bottom: 1px dashed var(--line);
// // //     }

// // //     .checkout-cta {
// // //       width: 100%;
// // //       background: var(--accent);
// // //       color: #fff;
// // //       font-weight: 600;
// // //       font-size: 14px;
// // //       padding: 12px 18px;
// // //       border-radius: 10px;
// // //       transition:
// // //         background-color 0.15s ease,
// // //         opacity 0.15s ease;
// // //     }
// // //     .checkout-cta:hover:not(:disabled) {
// // //       background: #000000;
// // //     }
// // //     .checkout-cta:disabled {
// // //       opacity: 0.45;
// // //       cursor: not-allowed;
// // //     }

// // //     .checkout-mobile-bar {
// // //       position: fixed;
// // //       left: 0;
// // //       right: 0;
// // //       bottom: 0;
// // //       z-index: 30;
// // //       background: var(--surface);
// // //       border-top: 1px solid var(--line);
// // //       padding: 12px 16px;
// // //       display: flex;
// // //       align-items: center;
// // //       justify-content: space-between;
// // //       gap: 12px;
// // //       box-shadow: 0 -4px 16px rgba(22, 33, 27, 0.06);
// // //     }

// // //     .checkout-spinner {
// // //       width: 16px;
// // //       height: 16px;
// // //       border-radius: 999px;
// // //       border: 2px solid var(--line);
// // //       border-top-color: var(--accent);
// // //       animation: checkout-spin 0.7s linear infinite;
// // //     }
// // //     @keyframes checkout-spin {
// // //       to {
// // //         transform: rotate(360deg);
// // //       }
// // //     }

// // //     @media (prefers-reduced-motion: reduce) {
// // //       .checkout-spinner {
// // //         animation: none;
// // //       }
// // //     }
// // //   `}</style>
// // // );

// // // export default CheckoutPage;
// // "use client";

// // import { useState, useEffect, useRef } from "react";
// // import { useRouter } from "next/navigation";
// // import Image from "next/image";
// // import {
// //   getToken,
// //   getUser,
// //   getGuestId,
// //   clearAuth,
// // } from "../../../src/lib/auth";

// // // ==================== TYPES ====================

// // interface Variant {
// //   _id: string;
// //   size?: string;
// //   color?: string;
// //   price: number;
// //   discountPrice?: number;
// //   image?: string;
// //   stock?: number;
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   price: number;
// //   discountPrice?: number;
// //   images?: string[];
// // }

// // interface CartItem {
// //   _id: string;
// //   product: Product;
// //   variant?: Variant;
// //   quantity: number;
// // }

// // interface Address {
// //   _id: string;
// //   fullName: string;
// //   phone: string;
// //   address: string;
// //   city: string;
// //   country: string;
// //   isDefault?: boolean;
// // }

// // interface NewAddress {
// //   fullName: string;
// //   phone: string;
// //   address: string;
// //   city: string;
// //   country: string;
// //   isDefault: boolean;
// // }

// // // ==================== HELPERS ====================

// // const getUserId = () => {
// //   const authUser = getUser();
// //   if (authUser?.id) return authUser.id;
// //   return getGuestId();
// // };

// // const getEffectivePrice = (item: CartItem): number => {
// //   if (
// //     item.variant?.discountPrice &&
// //     item.variant.discountPrice < item.variant.price
// //   ) {
// //     return item.variant.discountPrice;
// //   }
// //   if (item.variant?.price) return item.variant.price;
// //   if (
// //     item.product?.discountPrice &&
// //     item.product.discountPrice < item.product.price
// //   ) {
// //     return item.product.discountPrice;
// //   }
// //   return item.product?.price ?? 0;
// // };

// // const getOriginalPrice = (item: CartItem): number =>
// //   item.variant?.price ?? item.product?.price ?? 0;

// // const isOnSale = (item: CartItem): boolean =>
// //   !!(
// //     item.variant?.discountPrice &&
// //     item.variant.discountPrice < item.variant.price
// //   ) ||
// //   !!(
// //     item.product?.discountPrice &&
// //     item.product.discountPrice < item.product.price
// //   );

// // // ==================== SMALL UI PRIMITIVES ====================

// // const StepBadge = ({ n }: { n: number }) => (
// //   <span className="checkout-step-badge">{n}</span>
// // );

// // // ==================== COMPONENT ====================

// // const CheckoutPage = () => {
// //   const router = useRouter();
// //   const userId = getUserId();

// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// //   const [addresses, setAddresses] = useState<Address[]>([]);
// //   const [selectedAddress, setSelectedAddress] = useState<string>("");
// //   const [useNewAddress, setUseNewAddress] = useState(false);
// //   const [newAddress, setNewAddress] = useState<NewAddress>({
// //     fullName: "",
// //     phone: "",
// //     address: "",
// //     city: "",
// //     country: "",
// //     isDefault: false,
// //   });
// //   const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
// //     "cash",
// //   );
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // ✅ Đếm số request "GET cart" đang bay để chỉ áp dụng kết quả của request
// //   // MỚI NHẤT vào state. Trước đây nếu 2 lần fetchCart() chạy gần nhau (1 lần
// //   // do mount, 1 lần do sự kiện "cart-updated"), response nào trả về SAU sẽ
// //   // ghi đè state — dù nó là request cũ hơn và có thể chứa dữ liệu đã lỗi thời
// //   // (ví dụ item vừa xoá ở trang giỏ hàng nhưng chưa kịp phản ánh ở server tại
// //   // thời điểm request đó được gửi đi).
// //   const fetchIdRef = useRef(0);

// //   const formatPrice = (price: number) =>
// //     new Intl.NumberFormat("vi-VN", {
// //       style: "currency",
// //       currency: "VND",
// //     }).format(price);

// //   const redirectToLogin = () => {
// //     clearAuth();
// //     router.push("/login?redirect=/checkout");
// //   };

// //   // ✅ Tách fetchCart ra ngoài để có thể tái sử dụng (mount, event, trước khi submit)
// //   const fetchCart = async () => {
// //     const myFetchId = ++fetchIdRef.current;
// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
// //         {
// //           credentials: "include",
// //           cache: "no-store", // ✅ luôn lấy dữ liệu mới nhất từ server
// //         },
// //       );
// //       if (res.status === 401) {
// //         redirectToLogin();
// //         return [];
// //       }
// //       if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// //       const data = await res.json();
// //       const items: CartItem[] = data.items || [];

// //       // ✅ Nếu đã có một fetchCart() khác được gọi SAU lần này (ví dụ do
// //       // handleCheckout gọi lại ngay trước khi submit), bỏ qua kết quả của
// //       // lần gọi cũ hơn để tránh ghi đè dữ liệu mới bằng dữ liệu cũ.
// //       if (myFetchId !== fetchIdRef.current) return items;

// //       setCartItems(items);
// //       return items;
// //     } catch (err: unknown) {
// //       if (myFetchId !== fetchIdRef.current) return [];
// //       setError(
// //         err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
// //       );
// //       return [];
// //     }
// //   };

// //   useEffect(() => {
// //     const token = getToken();
// //     if (!token) {
// //       redirectToLogin();
// //       return;
// //     }

// //     const fetchAddresses = async () => {
// //       try {
// //         const res = await fetch(
// //           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //             credentials: "include",
// //           },
// //         );
// //         if (res.status === 401) {
// //           redirectToLogin();
// //           return;
// //         }
// //         if (!res.ok) {
// //           const errorData = await res.json().catch(() => ({}));
// //           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
// //         }
// //         const data: Address[] = await res.json();
// //         setAddresses(data);
// //         const defaultAddress = data.find((addr) => addr.isDefault);
// //         if (defaultAddress) setSelectedAddress(defaultAddress._id);
// //       } catch (err: unknown) {
// //         setError(
// //           err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCart();
// //     fetchAddresses();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [userId, router]);

// //   // ✅ Nếu ở trang giỏ hàng bạn vừa xóa sản phẩm rồi bấm "Thanh toán" ngay,
// //   // event này đảm bảo trang Checkout tự cập nhật lại đúng giỏ hàng mới nhất.
// //   // Kết hợp với fetchIdRef ở trên, request này sẽ luôn "thắng" các request
// //   // GET cart cũ hơn (kể cả request gọi lúc mount) nếu nó trả về sau.
// //   useEffect(() => {
// //     window.addEventListener("cart-updated", fetchCart);
// //     return () => window.removeEventListener("cart-updated", fetchCart);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [userId]);

// //   const subtotal = cartItems.reduce(
// //     (total, item) => total + getEffectivePrice(item) * item.quantity,
// //     0,
// //   );
// //   const totalItems = cartItems.reduce((n, item) => n + item.quantity, 0);
// //   const savings = cartItems.reduce((n, item) => {
// //     if (!isOnSale(item)) return n;
// //     return (
// //       n + (getOriginalPrice(item) - getEffectivePrice(item)) * item.quantity
// //     );
// //   }, 0);

// //   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value, type, checked } = e.target;
// //     setNewAddress((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const handleCheckout = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     const token = getToken();
// //     if (!token) {
// //       redirectToLogin();
// //       return;
// //     }
// //     if (!selectedAddress && !useNewAddress) {
// //       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
// //       return;
// //     }
// //     if (
// //       useNewAddress &&
// //       (!newAddress.fullName ||
// //         !newAddress.phone ||
// //         !newAddress.address ||
// //         !newAddress.city ||
// //         !newAddress.country)
// //     ) {
// //       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
// //       return;
// //     }

// //     setSubmitting(true);
// //     setError(null);

// //     try {
// //       // ✅ QUAN TRỌNG: refetch giỏ hàng ngay trước khi submit, không dùng
// //       // "cartItems" cũ trong state/closure — đảm bảo sản phẩm đã bị xóa
// //       // trước đó chắc chắn không được gửi lên server nữa. Nhờ fetchIdRef,
// //       // đây luôn là request "mới nhất" nên chắc chắn được áp dụng vào state.
// //       const freshItems = await fetchCart();

// //       if (freshItems.length === 0) {
// //         setError("Giỏ hàng trống.");
// //         setSubmitting(false);
// //         return;
// //       }

// //       const freshSubtotal = freshItems.reduce(
// //         (total, item) => total + getEffectivePrice(item) * item.quantity,
// //         0,
// //       );

// //       const payload = {
// //         products: freshItems.map((item) => ({
// //           product: item.product._id,
// //           variant: item.variant?._id,
// //           quantity: item.quantity,
// //         })),
// //         totalPrice: freshSubtotal,
// //         paymentMethod,
// //         ...(useNewAddress
// //           ? { newShippingAddress: newAddress }
// //           : { shippingAddress: selectedAddress }),
// //       };

// //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         credentials: "include",
// //         body: JSON.stringify(payload),
// //       });

// //       if (res.status === 401) {
// //         redirectToLogin();
// //         return;
// //       }
// //       if (!res.ok) {
// //         const errorData = await res.json().catch(() => ({}));
// //         throw new Error(errorData.error || "Thanh toán thất bại");
// //       }

// //       const createdOrder = await res.json();

// //       // ✅ Xóa sạch giỏ hàng phía client ngay sau khi đặt hàng thành công,
// //       // để nếu user quay lại trang giỏ hàng/checkout sẽ không thấy sản phẩm cũ
// //       setCartItems([]);
// //       window.dispatchEvent(new Event("cart-updated"));

// //       router.push(`/order-confirmation?orderId=${createdOrder._id}`);
// //     } catch (err: unknown) {
// //       setError(
// //         err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt hàng",
// //       );
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const canSubmit =
// //     !submitting && cartItems.length > 0 && (!!selectedAddress || useNewAddress);

// //   if (loading) {
// //     return (
// //       <div className="checkout-root min-h-screen flex justify-center items-center">
// //         <div className="flex items-center gap-3 text-[15px] text-[var(--muted)]">
// //           <span className="checkout-spinner" />
// //           Đang tải thông tin thanh toán...
// //         </div>
// //         <CheckoutStyles />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="checkout-root min-h-screen pb-28 lg:pb-12">
// //       <CheckoutStyles />

// //       {/* Header / progress */}
// //       <div className="border-b border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur sticky top-0 z-20">
// //         <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 flex items-center justify-between">
// //           <h1 className="font-display text-xl sm:text-2xl font-semibold text-[var(--ink)]">
// //             Thanh toán
// //           </h1>
// //           <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--muted)] tracking-wide">
// //             <span className="text-[var(--ink)]">Giỏ hàng</span>
// //             <span className="checkout-dot" />
// //             <span className="text-[var(--ink)]">Giao hàng</span>
// //             <span className="checkout-dot" />
// //             <span>Xác nhận</span>
// //           </div>
// //         </div>
// //       </div>

// //       <form
// //         onSubmit={handleCheckout}
// //         className="px-4 sm:px-8 md:px-16 lg:px-60 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start"
// //       >
// //         {/* ================= LEFT COLUMN ================= */}
// //         <div className="space-y-6">
// //           {/* Step 1 — Giỏ hàng */}
// //           <section className="checkout-card">
// //             <div className="flex items-center gap-3 mb-5">
// //               <StepBadge n={1} />
// //               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
// //                 Giỏ hàng của bạn
// //               </h2>
// //               {totalItems > 0 && (
// //                 <span className="ml-auto text-xs text-[var(--muted)]">
// //                   {totalItems} sản phẩm
// //                 </span>
// //               )}
// //             </div>

// //             {cartItems.length === 0 ? (
// //               <p className="text-sm text-[var(--muted)]">Giỏ hàng trống.</p>
// //             ) : (
// //               <ul className="divide-y divide-[var(--line)]">
// //                 {cartItems.map((item) => {
// //                   const effectivePrice = getEffectivePrice(item);
// //                   const originalPrice = getOriginalPrice(item);
// //                   const onSale = isOnSale(item);

// //                   return (
// //                     <li
// //                       key={item._id}
// //                       className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
// //                     >
// //                       <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--paper)] shrink-0 ring-1 ring-[var(--line)]">
// //                         <Image
// //                           src={
// //                             item.variant?.image ||
// //                             item.product?.images?.[0] ||
// //                             "/img/placeholder.jpg"
// //                           }
// //                           alt={item.product?.name || "Sản phẩm"}
// //                           fill
// //                           className="object-cover"
// //                         />
// //                       </div>
// //                       <div className="flex-1 min-w-0">
// //                         <p className="font-medium text-sm text-[var(--ink)] truncate">
// //                           {item.product?.name}
// //                         </p>
// //                         {item.variant && (
// //                           <p className="text-xs text-[var(--muted)] mt-0.5">
// //                             {item.variant.size && `Size ${item.variant.size}`}
// //                             {item.variant.size && item.variant.color && " · "}
// //                             {item.variant.color && `Màu ${item.variant.color}`}
// //                           </p>
// //                         )}
// //                         <p className="text-xs text-[var(--muted)] mt-0.5">
// //                           SL: {item.quantity}
// //                         </p>
// //                       </div>
// //                       <div className="text-right shrink-0">
// //                         <div className="font-semibold text-sm text-[var(--ink)]">
// //                           {formatPrice(effectivePrice * item.quantity)}
// //                         </div>
// //                         {onSale && (
// //                           <div className="text-xs mt-0.5 space-x-1.5">
// //                             <span className="line-through text-[var(--muted)]">
// //                               {formatPrice(originalPrice)}
// //                             </span>
// //                             <span className="text-[var(--sale)]">
// //                               {formatPrice(effectivePrice)}
// //                             </span>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </li>
// //                   );
// //                 })}
// //               </ul>
// //             )}
// //           </section>

// //           {/* Step 2 — Địa chỉ giao hàng */}
// //           <section className="checkout-card">
// //             <div className="flex items-center gap-3 mb-5">
// //               <StepBadge n={2} />
// //               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
// //                 Địa chỉ giao hàng
// //               </h2>
// //             </div>

// //             {addresses.length > 0 && (
// //               <div className="space-y-2.5 mb-4">
// //                 {addresses.map((addr) => {
// //                   const checked =
// //                     selectedAddress === addr._id && !useNewAddress;
// //                   return (
// //                     <label
// //                       key={addr._id}
// //                       className={`checkout-option ${checked ? "checkout-option--active" : ""}`}
// //                     >
// //                       <input
// //                         type="radio"
// //                         name="address"
// //                         value={addr._id}
// //                         checked={checked}
// //                         onChange={() => {
// //                           setSelectedAddress(addr._id);
// //                           setUseNewAddress(false);
// //                         }}
// //                         className="checkout-radio"
// //                       />
// //                       <div className="min-w-0">
// //                         <div className="flex items-center gap-2 flex-wrap">
// //                           <p className="font-medium text-sm text-[var(--ink)]">
// //                             {addr.fullName}
// //                           </p>
// //                           {addr.isDefault && (
// //                             <span className="checkout-tag">Mặc định</span>
// //                           )}
// //                         </div>
// //                         <p className="text-xs text-[var(--muted)] mt-0.5">
// //                           {addr.address}, {addr.city}, {addr.country}
// //                         </p>
// //                         <p className="text-xs text-[var(--muted)]">
// //                           SĐT: {addr.phone}
// //                         </p>
// //                       </div>
// //                     </label>
// //                   );
// //                 })}
// //               </div>
// //             )}

// //             <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none">
// //               <input
// //                 type="checkbox"
// //                 checked={useNewAddress}
// //                 onChange={() => setUseNewAddress(!useNewAddress)}
// //                 className="checkout-checkbox"
// //               />
// //               Nhập địa chỉ mới
// //             </label>

// //             {useNewAddress && (
// //               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                 {(
// //                   ["fullName", "phone", "address", "city", "country"] as const
// //                 ).map((field) => (
// //                   <input
// //                     key={field}
// //                     type="text"
// //                     name={field}
// //                     value={newAddress[field]}
// //                     onChange={handleNewAddressChange}
// //                     placeholder={
// //                       {
// //                         fullName: "Họ và tên",
// //                         phone: "Số điện thoại",
// //                         address: "Địa chỉ",
// //                         city: "Thành phố",
// //                         country: "Quốc gia",
// //                       }[field]
// //                     }
// //                     className={`checkout-input ${
// //                       field === "address" ? "sm:col-span-2" : ""
// //                     }`}
// //                   />
// //                 ))}
// //                 <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none sm:col-span-2">
// //                   <input
// //                     type="checkbox"
// //                     name="isDefault"
// //                     checked={newAddress.isDefault}
// //                     onChange={handleNewAddressChange}
// //                     className="checkout-checkbox"
// //                   />
// //                   Đặt làm địa chỉ mặc định
// //                 </label>
// //               </div>
// //             )}
// //           </section>

// //           {/* Step 3 — Phương thức thanh toán */}
// //           <section className="checkout-card">
// //             <div className="flex items-center gap-3 mb-5">
// //               <StepBadge n={3} />
// //               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
// //                 Phương thức thanh toán
// //               </h2>
// //             </div>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
// //               <label
// //                 className={`checkout-option ${
// //                   paymentMethod === "cash" ? "checkout-option--active" : ""
// //                 }`}
// //               >
// //                 <input
// //                   type="radio"
// //                   name="paymentMethod"
// //                   value="cash"
// //                   checked={paymentMethod === "cash"}
// //                   onChange={() => setPaymentMethod("cash")}
// //                   className="checkout-radio"
// //                 />
// //                 <div>
// //                   <p className="font-medium text-sm text-[var(--ink)]">
// //                     Thanh toán khi nhận hàng
// //                   </p>
// //                   <p className="text-xs text-[var(--muted)] mt-0.5">COD</p>
// //                 </div>
// //               </label>
// //               <label
// //                 className={`checkout-option ${
// //                   paymentMethod === "bank_transfer"
// //                     ? "checkout-option--active"
// //                     : ""
// //                 }`}
// //               >
// //                 <input
// //                   type="radio"
// //                   name="paymentMethod"
// //                   value="bank_transfer"
// //                   checked={paymentMethod === "bank_transfer"}
// //                   onChange={() => setPaymentMethod("bank_transfer")}
// //                   className="checkout-radio"
// //                 />
// //                 <div>
// //                   <p className="font-medium text-sm text-[var(--ink)]">
// //                     Chuyển khoản ngân hàng
// //                   </p>
// //                   <p className="text-xs text-[var(--muted)] mt-0.5">
// //                     Xác nhận thủ công
// //                   </p>
// //                 </div>
// //               </label>
// //             </div>
// //           </section>

// //           {error && (
// //             <p className="text-sm text-[var(--sale)] bg-[var(--sale-soft)] border border-[var(--sale)]/20 rounded-lg px-4 py-3">
// //               {error}
// //             </p>
// //           )}
// //         </div>

// //         {/* ================= RIGHT COLUMN — RECEIPT SUMMARY ================= */}
// //         <aside className="lg:sticky lg:top-24">
// //           <div className="checkout-receipt">
// //             <p className="font-display text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-4">
// //               Tóm tắt đơn hàng
// //             </p>

// //             <div className="space-y-2 text-sm">
// //               <div className="flex justify-between text-[var(--muted)]">
// //                 <span>Tạm tính ({totalItems} sản phẩm)</span>
// //                 <span className="text-[var(--ink)]">
// //                   {formatPrice(subtotal + savings)}
// //                 </span>
// //               </div>
// //               {savings > 0 && (
// //                 <div className="flex justify-between text-[var(--sale)]">
// //                   <span>Tiết kiệm</span>
// //                   <span>-{formatPrice(savings)}</span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between text-[var(--muted)]">
// //                 <span>Phí vận chuyển</span>
// //                 <span className="text-[var(--ink)]">Miễn phí</span>
// //               </div>
// //             </div>

// //             <div className="checkout-notches" />

// //             <div className="flex justify-between items-baseline">
// //               <span className="font-medium text-[var(--ink)]">Tổng cộng</span>
// //               <span className="font-display text-xl font-semibold text-[var(--ink)]">
// //                 {formatPrice(subtotal)}
// //               </span>
// //             </div>

// //             <button
// //               type="submit"
// //               className="checkout-cta mt-5"
// //               disabled={!canSubmit}
// //             >
// //               {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
// //             </button>

// //             <p className="text-[11px] text-[var(--muted)] text-center mt-3 leading-relaxed">
// //               Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của chúng
// //               tôi.
// //             </p>
// //           </div>
// //         </aside>

// //         {/* Mobile sticky total bar */}
// //         <div className="checkout-mobile-bar lg:hidden">
// //           <div>
// //             <p className="text-[11px] text-[var(--muted)]">Tổng cộng</p>
// //             <p className="font-display text-base font-semibold text-[var(--ink)]">
// //               {formatPrice(subtotal)}
// //             </p>
// //           </div>
// //           <button
// //             type="submit"
// //             className="checkout-cta w-auto px-6"
// //             disabled={!canSubmit}
// //           >
// //             {submitting ? "Đang xử lý..." : "Đặt hàng"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // // ==================== STYLES ====================

// // const CheckoutStyles = () => (
// //   <style jsx global>{`
// //     @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");

// //     .checkout-root {
// //       --paper: #f5f5f4;
// //       --surface: #ffffff;
// //       --ink: #111111;
// //       --muted: #6b6b6b;
// //       --line: #e2e2e0;
// //       --accent: #111111;
// //       --accent-soft: #ececea;
// //       --sale: #111111;
// //       --sale-soft: #ececea;
// //       --gold: #111111;
// //       background: var(--paper);
// //       font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
// //       color: var(--ink);
// //     }
// //     .checkout-root .font-display {
// //       font-family:
// //         "Be Vietnam Pro", "Inter", ui-sans-serif, system-ui, sans-serif;
// //     }

// //     .checkout-card {
// //       background: var(--surface);
// //       border: 1px solid var(--line);
// //       border-radius: 16px;
// //       padding: 20px;
// //     }
// //     @media (min-width: 640px) {
// //       .checkout-card {
// //         padding: 24px 28px;
// //       }
// //     }

// //     .checkout-step-badge {
// //       display: inline-flex;
// //       align-items: center;
// //       justify-content: center;
// //       width: 26px;
// //       height: 26px;
// //       border-radius: 999px;
// //       background: var(--accent-soft);
// //       color: var(--accent);
// //       font-family: "Be Vietnam Pro", sans-serif;
// //       font-weight: 700;
// //       font-size: 12px;
// //       flex-shrink: 0;
// //     }

// //     .checkout-dot {
// //       width: 3px;
// //       height: 3px;
// //       border-radius: 999px;
// //       background: var(--muted);
// //       display: inline-block;
// //     }

// //     .checkout-option {
// //       display: flex;
// //       align-items: flex-start;
// //       gap: 12px;
// //       border: 1px solid var(--line);
// //       border-radius: 12px;
// //       padding: 12px 14px;
// //       cursor: pointer;
// //       transition:
// //         border-color 0.15s ease,
// //         background-color 0.15s ease;
// //     }
// //     .checkout-option:hover {
// //       border-color: var(--accent);
// //     }
// //     .checkout-option--active {
// //       border-color: var(--accent);
// //       background: var(--accent-soft);
// //     }

// //     .checkout-radio {
// //       margin-top: 2px;
// //       accent-color: var(--accent);
// //       width: 16px;
// //       height: 16px;
// //       flex-shrink: 0;
// //     }
// //     .checkout-checkbox {
// //       accent-color: var(--accent);
// //       width: 16px;
// //       height: 16px;
// //     }

// //     .checkout-tag {
// //       font-size: 10px;
// //       font-weight: 600;
// //       letter-spacing: 0.02em;
// //       color: var(--ink);
// //       background: var(--accent-soft);
// //       border-radius: 999px;
// //       padding: 2px 8px;
// //     }

// //     .checkout-input {
// //       width: 100%;
// //       border: 1px solid var(--line);
// //       background: var(--surface);
// //       border-radius: 10px;
// //       padding: 10px 14px;
// //       font-size: 14px;
// //       color: var(--ink);
// //       outline: none;
// //       transition: border-color 0.15s ease;
// //     }
// //     .checkout-input:focus {
// //       border-color: var(--accent);
// //     }
// //     .checkout-input::placeholder {
// //       color: var(--muted);
// //     }

// //     .checkout-receipt {
// //       background: var(--surface);
// //       border: 1px solid var(--line);
// //       border-radius: 16px;
// //       padding: 22px 24px 20px;
// //       box-shadow: 0 1px 2px rgba(22, 33, 27, 0.04);
// //     }

// //     .checkout-notches {
// //       height: 14px;
// //       margin: 14px -24px 12px;
// //       background-image: radial-gradient(
// //         circle at 10px 7px,
// //         var(--paper) 7px,
// //         transparent 7.5px
// //       );
// //       background-size: 20px 14px;
// //       background-repeat: repeat-x;
// //       background-position: center;
// //       border-top: 1px dashed var(--line);
// //       border-bottom: 1px dashed var(--line);
// //     }

// //     .checkout-cta {
// //       width: 100%;
// //       background: var(--accent);
// //       color: #fff;
// //       font-weight: 600;
// //       font-size: 14px;
// //       padding: 12px 18px;
// //       border-radius: 10px;
// //       transition:
// //         background-color 0.15s ease,
// //         opacity 0.15s ease;
// //     }
// //     .checkout-cta:hover:not(:disabled) {
// //       background: #000000;
// //     }
// //     .checkout-cta:disabled {
// //       opacity: 0.45;
// //       cursor: not-allowed;
// //     }

// //     .checkout-mobile-bar {
// //       position: fixed;
// //       left: 0;
// //       right: 0;
// //       bottom: 0;
// //       z-index: 30;
// //       background: var(--surface);
// //       border-top: 1px solid var(--line);
// //       padding: 12px 16px;
// //       display: flex;
// //       align-items: center;
// //       justify-content: space-between;
// //       gap: 12px;
// //       box-shadow: 0 -4px 16px rgba(22, 33, 27, 0.06);
// //     }

// //     .checkout-spinner {
// //       width: 16px;
// //       height: 16px;
// //       border-radius: 999px;
// //       border: 2px solid var(--line);
// //       border-top-color: var(--accent);
// //       animation: checkout-spin 0.7s linear infinite;
// //     }
// //     @keyframes checkout-spin {
// //       to {
// //         transform: rotate(360deg);
// //       }
// //     }

// //     @media (prefers-reduced-motion: reduce) {
// //       .checkout-spinner {
// //         animation: none;
// //       }
// //     }
// //   `}</style>
// // );

// // export default CheckoutPage;
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   getToken,
//   getUser,
//   getGuestId,
//   clearAuth,
// } from "../../../src/lib/auth";

// // ==================== TYPES ====================

// interface Variant {
//   _id?: string;
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
//   price?: number;
//   discountPrice?: number;
//   images?: string[];
// }

// interface CartItem {
//   _id: string;
//   product: Product;
//   variant?: Variant | null;
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
//   if (typeof window === "undefined") return "";
//   const authUser = getUser();
//   if (authUser?.id) return authUser.id;
//   return getGuestId() || "";
// };

// /** Item hợp lệ: có _id, có product, quantity > 0 */
// const isValidCartItem = (item: CartItem): boolean => {
//   return !!(item?._id && item.product?._id && item.quantity > 0);
// };

// const getEffectivePrice = (item: CartItem): number => {
//   const v = item.variant;
//   if (v?.discountPrice != null && v.discountPrice < (v.price ?? 0)) {
//     return v.discountPrice;
//   }
//   if (v?.price != null) return v.price;
//   // fallback product
//   if (
//     item.product?.discountPrice != null &&
//     item.product.discountPrice < (item.product.price ?? 0)
//   ) {
//     return item.product.discountPrice;
//   }
//   return item.product?.price ?? 0;
// };

// const getOriginalPrice = (item: CartItem): number =>
//   item.variant?.price ?? item.product?.price ?? 0;

// const isOnSale = (item: CartItem): boolean => {
//   const v = item.variant;
//   if (v?.discountPrice != null && v.discountPrice < (v.price ?? 0)) return true;
//   if (
//     item.product?.discountPrice != null &&
//     item.product.discountPrice < (item.product.price ?? 0)
//   ) {
//     return true;
//   }
//   return false;
// };

// const getImageUrl = (imgPath?: string | null): string => {
//   if (!imgPath) return "/img/placeholder.jpg";
//   if (imgPath.startsWith("http")) {
//     return imgPath.replace(/^http:\/\//, "https://");
//   }
//   return `${process.env.NEXT_PUBLIC_API_URL}${
//     imgPath.startsWith("/") ? "" : "/"
//   }${imgPath}`;
// };

// // ==================== SMALL UI PRIMITIVES ====================

// const StepBadge = ({ n }: { n: number }) => (
//   <span className="checkout-step-badge">{n}</span>
// );

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

//   // Chỉ áp dụng kết quả của request GET cart MỚI NHẤT
//   const fetchIdRef = useRef(0);

//   const formatPrice = (price: number) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);

//   const redirectToLogin = useCallback(() => {
//     clearAuth();
//     router.push("/login?redirect=/checkout");
//   }, [router]);

//   // ─── Fetch cart ───────────────────────────────────────
//   const fetchCart = useCallback(async (): Promise<CartItem[]> => {
//     if (!userId) return [];

//     const myFetchId = ++fetchIdRef.current;

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
//         {
//           credentials: "include",
//           cache: "no-store",
//         },
//       );

//       if (res.status === 401) {
//         redirectToLogin();
//         return [];
//       }
//       if (!res.ok) throw new Error("Không thể tải giỏ hàng");

//       const data = await res.json();
//       const items: CartItem[] = (data.items || []).filter(isValidCartItem);

//       // Bỏ qua response cũ hơn
//       if (myFetchId !== fetchIdRef.current) return items;

//       setCartItems(items);
//       return items;
//     } catch (err: unknown) {
//       if (myFetchId !== fetchIdRef.current) return [];
//       setError(
//         err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
//       );
//       return [];
//     }
//   }, [userId, redirectToLogin]);

//   // ─── Mount: load cart + addresses ─────────────────────
//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       redirectToLogin();
//       return;
//     }

//     const fetchAddresses = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             credentials: "include",
//           },
//         );
//         if (res.status === 401) {
//           redirectToLogin();
//           return;
//         }
//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(
//             (errorData as { error?: string }).error ||
//               "Không thể tải danh sách địa chỉ",
//           );
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
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId, router]);

//   // Refetch khi có sự kiện cart-updated (xóa/sửa ở trang giỏ hàng)
//   useEffect(() => {
//     window.addEventListener("cart-updated", fetchCart);
//     return () => window.removeEventListener("cart-updated", fetchCart);
//   }, [fetchCart]);

//   // ─── Derived ──────────────────────────────────────────
//   const subtotal = cartItems.reduce(
//     (total, item) => total + getEffectivePrice(item) * item.quantity,
//     0,
//   );
//   const totalItems = cartItems.reduce((n, item) => n + item.quantity, 0);
//   const savings = cartItems.reduce((n, item) => {
//     if (!isOnSale(item)) return n;
//     return (
//       n + (getOriginalPrice(item) - getEffectivePrice(item)) * item.quantity
//     );
//   }, 0);

//   // ─── Address form ─────────────────────────────────────
//   const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setNewAddress((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ─── Submit order ─────────────────────────────────────
//   const handleCheckout = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = getToken();
//     if (!token) {
//       redirectToLogin();
//       return;
//     }
//     if (!selectedAddress && !useNewAddress) {
//       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
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
//       // Refetch ngay trước submit — đảm bảo không gửi item đã xóa
//       const freshItems = (await fetchCart()).filter(isValidCartItem);

//       if (freshItems.length === 0) {
//         setError("Giỏ hàng trống hoặc chứa sản phẩm không hợp lệ.");
//         setSubmitting(false);
//         return;
//       }

//       const freshSubtotal = freshItems.reduce(
//         (total, item) => total + getEffectivePrice(item) * item.quantity,
//         0,
//       );

//       const payload = {
//         products: freshItems.map((item) => ({
//           product: item.product._id,
//           // Chỉ gửi variant nếu có — tránh lỗi khi item mất variant
//           ...(item.variant?._id ? { variant: item.variant._id } : {}),
//           quantity: item.quantity,
//         })),
//         totalPrice: freshSubtotal,
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

//       if (res.status === 401) {
//         redirectToLogin();
//         return;
//       }
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(
//           (errorData as { error?: string }).error || "Thanh toán thất bại",
//         );
//       }

//       const createdOrder = await res.json();

//       // Xóa sạch giỏ phía client
//       setCartItems([]);
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

//   const canSubmit =
//     !submitting && cartItems.length > 0 && (!!selectedAddress || useNewAddress);

//   // ─── Loading ──────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="checkout-root min-h-screen flex justify-center items-center">
//         <div className="flex items-center gap-3 text-[15px] text-[var(--muted)]">
//           <span className="checkout-spinner" />
//           Đang tải thông tin thanh toán...
//         </div>
//         <CheckoutStyles />
//       </div>
//     );
//   }

//   // ─── Render ───────────────────────────────────────────
//   return (
//     <div className="checkout-root min-h-screen pb-28 lg:pb-12">
//       <CheckoutStyles />

//       {/* Header / progress */}
//       <div className="border-b border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur sticky top-0 z-20">
//         <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 flex items-center justify-between">
//           <h1 className="font-display text-xl sm:text-2xl font-semibold text-[var(--ink)]">
//             Thanh toán
//           </h1>
//           <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--muted)] tracking-wide">
//             <span className="text-[var(--ink)]">Giỏ hàng</span>
//             <span className="checkout-dot" />
//             <span className="text-[var(--ink)]">Giao hàng</span>
//             <span className="checkout-dot" />
//             <span>Xác nhận</span>
//           </div>
//         </div>
//       </div>

//       <form
//         onSubmit={handleCheckout}
//         className="px-4 sm:px-8 md:px-16 lg:px-60 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start"
//       >
//         {/* ================= LEFT COLUMN ================= */}
//         <div className="space-y-6">
//           {/* Step 1 — Giỏ hàng */}
//           <section className="checkout-card">
//             <div className="flex items-center gap-3 mb-5">
//               <StepBadge n={1} />
//               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
//                 Giỏ hàng của bạn
//               </h2>
//               {totalItems > 0 && (
//                 <span className="ml-auto text-xs text-[var(--muted)]">
//                   {totalItems} sản phẩm
//                 </span>
//               )}
//             </div>

//             {cartItems.length === 0 ? (
//               <p className="text-sm text-[var(--muted)]">Giỏ hàng trống.</p>
//             ) : (
//               <ul className="divide-y divide-[var(--line)]">
//                 {cartItems.map((item) => {
//                   const effectivePrice = getEffectivePrice(item);
//                   const originalPrice = getOriginalPrice(item);
//                   const onSale = isOnSale(item);

//                   return (
//                     <li
//                       key={item._id}
//                       className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
//                     >
//                       <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--paper)] shrink-0 ring-1 ring-[var(--line)]">
//                         <Image
//                           src={getImageUrl(
//                             item.variant?.image || item.product?.images?.[0],
//                           )}
//                           alt={item.product?.name || "Sản phẩm"}
//                           fill
//                           unoptimized
//                           className="object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm text-[var(--ink)] truncate">
//                           {item.product?.name || "Không có tên"}
//                         </p>
//                         {item.variant &&
//                           (item.variant.size || item.variant.color) && (
//                             <p className="text-xs text-[var(--muted)] mt-0.5">
//                               {item.variant.size && `Size ${item.variant.size}`}
//                               {item.variant.size && item.variant.color && " · "}
//                               {item.variant.color &&
//                                 `Màu ${item.variant.color}`}
//                             </p>
//                           )}
//                         <p className="text-xs text-[var(--muted)] mt-0.5">
//                           SL: {item.quantity}
//                         </p>
//                       </div>
//                       <div className="text-right shrink-0">
//                         <div className="font-semibold text-sm text-[var(--ink)]">
//                           {formatPrice(effectivePrice * item.quantity)}
//                         </div>
//                         {onSale && (
//                           <div className="text-xs mt-0.5 space-x-1.5">
//                             <span className="line-through text-[var(--muted)]">
//                               {formatPrice(originalPrice)}
//                             </span>
//                             <span className="text-[var(--sale)]">
//                               {formatPrice(effectivePrice)}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </section>

//           {/* Step 2 — Địa chỉ giao hàng */}
//           <section className="checkout-card">
//             <div className="flex items-center gap-3 mb-5">
//               <StepBadge n={2} />
//               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
//                 Địa chỉ giao hàng
//               </h2>
//             </div>

//             {addresses.length > 0 && (
//               <div className="space-y-2.5 mb-4">
//                 {addresses.map((addr) => {
//                   const checked =
//                     selectedAddress === addr._id && !useNewAddress;
//                   return (
//                     <label
//                       key={addr._id}
//                       className={`checkout-option ${
//                         checked ? "checkout-option--active" : ""
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="address"
//                         value={addr._id}
//                         checked={checked}
//                         onChange={() => {
//                           setSelectedAddress(addr._id);
//                           setUseNewAddress(false);
//                         }}
//                         className="checkout-radio"
//                       />
//                       <div className="min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className="font-medium text-sm text-[var(--ink)]">
//                             {addr.fullName}
//                           </p>
//                           {addr.isDefault && (
//                             <span className="checkout-tag">Mặc định</span>
//                           )}
//                         </div>
//                         <p className="text-xs text-[var(--muted)] mt-0.5">
//                           {addr.address}, {addr.city}, {addr.country}
//                         </p>
//                         <p className="text-xs text-[var(--muted)]">
//                           SĐT: {addr.phone}
//                         </p>
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             )}

//             <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none">
//               <input
//                 type="checkbox"
//                 checked={useNewAddress}
//                 onChange={() => setUseNewAddress(!useNewAddress)}
//                 className="checkout-checkbox"
//               />
//               Nhập địa chỉ mới
//             </label>

//             {useNewAddress && (
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {(
//                   ["fullName", "phone", "address", "city", "country"] as const
//                 ).map((field) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={field}
//                     value={newAddress[field]}
//                     onChange={handleNewAddressChange}
//                     placeholder={
//                       {
//                         fullName: "Họ và tên",
//                         phone: "Số điện thoại",
//                         address: "Địa chỉ",
//                         city: "Thành phố",
//                         country: "Quốc gia",
//                       }[field]
//                     }
//                     className={`checkout-input ${
//                       field === "address" ? "sm:col-span-2" : ""
//                     }`}
//                   />
//                 ))}
//                 <label className="flex items-center gap-2.5 text-sm text-[var(--ink)] cursor-pointer select-none sm:col-span-2">
//                   <input
//                     type="checkbox"
//                     name="isDefault"
//                     checked={newAddress.isDefault}
//                     onChange={handleNewAddressChange}
//                     className="checkout-checkbox"
//                   />
//                   Đặt làm địa chỉ mặc định
//                 </label>
//               </div>
//             )}
//           </section>

//           {/* Step 3 — Phương thức thanh toán */}
//           <section className="checkout-card">
//             <div className="flex items-center gap-3 mb-5">
//               <StepBadge n={3} />
//               <h2 className="font-display text-base sm:text-lg font-semibold text-[var(--ink)]">
//                 Phương thức thanh toán
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
//               <label
//                 className={`checkout-option ${
//                   paymentMethod === "cash" ? "checkout-option--active" : ""
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="cash"
//                   checked={paymentMethod === "cash"}
//                   onChange={() => setPaymentMethod("cash")}
//                   className="checkout-radio"
//                 />
//                 <div>
//                   <p className="font-medium text-sm text-[var(--ink)]">
//                     Thanh toán khi nhận hàng
//                   </p>
//                   <p className="text-xs text-[var(--muted)] mt-0.5">COD</p>
//                 </div>
//               </label>
//               <label
//                 className={`checkout-option ${
//                   paymentMethod === "bank_transfer"
//                     ? "checkout-option--active"
//                     : ""
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="bank_transfer"
//                   checked={paymentMethod === "bank_transfer"}
//                   onChange={() => setPaymentMethod("bank_transfer")}
//                   className="checkout-radio"
//                 />
//                 <div>
//                   <p className="font-medium text-sm text-[var(--ink)]">
//                     Chuyển khoản ngân hàng
//                   </p>
//                   <p className="text-xs text-[var(--muted)] mt-0.5">
//                     Xác nhận thủ công
//                   </p>
//                 </div>
//               </label>
//             </div>
//           </section>

//           {error && (
//             <p className="text-sm text-[var(--sale)] bg-[var(--sale-soft)] border border-[var(--sale)]/20 rounded-lg px-4 py-3">
//               {error}
//             </p>
//           )}
//         </div>

//         {/* ================= RIGHT COLUMN — RECEIPT ================= */}
//         <aside className="lg:sticky lg:top-24">
//           <div className="checkout-receipt">
//             <p className="font-display text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-4">
//               Tóm tắt đơn hàng
//             </p>

//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between text-[var(--muted)]">
//                 <span>Tạm tính ({totalItems} sản phẩm)</span>
//                 <span className="text-[var(--ink)]">
//                   {formatPrice(subtotal + savings)}
//                 </span>
//               </div>
//               {savings > 0 && (
//                 <div className="flex justify-between text-[var(--sale)]">
//                   <span>Tiết kiệm</span>
//                   <span>-{formatPrice(savings)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between text-[var(--muted)]">
//                 <span>Phí vận chuyển</span>
//                 <span className="text-[var(--ink)]">Miễn phí</span>
//               </div>
//             </div>

//             <div className="checkout-notches" />

//             <div className="flex justify-between items-baseline">
//               <span className="font-medium text-[var(--ink)]">Tổng cộng</span>
//               <span className="font-display text-xl font-semibold text-[var(--ink)]">
//                 {formatPrice(subtotal)}
//               </span>
//             </div>

//             <button
//               type="submit"
//               className="checkout-cta mt-5"
//               disabled={!canSubmit}
//             >
//               {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
//             </button>

//             <p className="text-[11px] text-[var(--muted)] text-center mt-3 leading-relaxed">
//               Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của chúng
//               tôi.
//             </p>
//           </div>
//         </aside>

//         {/* Mobile sticky total bar */}
//         <div className="checkout-mobile-bar lg:hidden">
//           <div>
//             <p className="text-[11px] text-[var(--muted)]">Tổng cộng</p>
//             <p className="font-display text-base font-semibold text-[var(--ink)]">
//               {formatPrice(subtotal)}
//             </p>
//           </div>
//           <button
//             type="submit"
//             className="checkout-cta w-auto px-6"
//             disabled={!canSubmit}
//           >
//             {submitting ? "Đang xử lý..." : "Đặt hàng"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // ==================== STYLES ====================

// const CheckoutStyles = () => (
//   <style jsx global>{`
//     @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");

//     .checkout-root {
//       --paper: #f5f5f4;
//       --surface: #ffffff;
//       --ink: #111111;
//       --muted: #6b6b6b;
//       --line: #e2e2e0;
//       --accent: #111111;
//       --accent-soft: #ececea;
//       --sale: #111111;
//       --sale-soft: #ececea;
//       --gold: #111111;
//       background: var(--paper);
//       font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
//       color: var(--ink);
//     }
//     .checkout-root .font-display {
//       font-family:
//         "Be Vietnam Pro", "Inter", ui-sans-serif, system-ui, sans-serif;
//     }

//     .checkout-card {
//       background: var(--surface);
//       border: 1px solid var(--line);
//       border-radius: 16px;
//       padding: 20px;
//     }
//     @media (min-width: 640px) {
//       .checkout-card {
//         padding: 24px 28px;
//       }
//     }

//     .checkout-step-badge {
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       width: 26px;
//       height: 26px;
//       border-radius: 999px;
//       background: var(--accent-soft);
//       color: var(--accent);
//       font-family: "Be Vietnam Pro", sans-serif;
//       font-weight: 700;
//       font-size: 12px;
//       flex-shrink: 0;
//     }

//     .checkout-dot {
//       width: 3px;
//       height: 3px;
//       border-radius: 999px;
//       background: var(--muted);
//       display: inline-block;
//     }

//     .checkout-option {
//       display: flex;
//       align-items: flex-start;
//       gap: 12px;
//       border: 1px solid var(--line);
//       border-radius: 12px;
//       padding: 12px 14px;
//       cursor: pointer;
//       transition:
//         border-color 0.15s ease,
//         background-color 0.15s ease;
//     }
//     .checkout-option:hover {
//       border-color: var(--accent);
//     }
//     .checkout-option--active {
//       border-color: var(--accent);
//       background: var(--accent-soft);
//     }

//     .checkout-radio {
//       margin-top: 2px;
//       accent-color: var(--accent);
//       width: 16px;
//       height: 16px;
//       flex-shrink: 0;
//     }
//     .checkout-checkbox {
//       accent-color: var(--accent);
//       width: 16px;
//       height: 16px;
//     }

//     .checkout-tag {
//       font-size: 10px;
//       font-weight: 600;
//       letter-spacing: 0.02em;
//       color: var(--ink);
//       background: var(--accent-soft);
//       border-radius: 999px;
//       padding: 2px 8px;
//     }

//     .checkout-input {
//       width: 100%;
//       border: 1px solid var(--line);
//       background: var(--surface);
//       border-radius: 10px;
//       padding: 10px 14px;
//       font-size: 14px;
//       color: var(--ink);
//       outline: none;
//       transition: border-color 0.15s ease;
//     }
//     .checkout-input:focus {
//       border-color: var(--accent);
//     }
//     .checkout-input::placeholder {
//       color: var(--muted);
//     }

//     .checkout-receipt {
//       background: var(--surface);
//       border: 1px solid var(--line);
//       border-radius: 16px;
//       padding: 22px 24px 20px;
//       box-shadow: 0 1px 2px rgba(22, 33, 27, 0.04);
//     }

//     .checkout-notches {
//       height: 14px;
//       margin: 14px -24px 12px;
//       background-image: radial-gradient(
//         circle at 10px 7px,
//         var(--paper) 7px,
//         transparent 7.5px
//       );
//       background-size: 20px 14px;
//       background-repeat: repeat-x;
//       background-position: center;
//       border-top: 1px dashed var(--line);
//       border-bottom: 1px dashed var(--line);
//     }

//     .checkout-cta {
//       width: 100%;
//       background: var(--accent);
//       color: #fff;
//       font-weight: 600;
//       font-size: 14px;
//       padding: 12px 18px;
//       border-radius: 10px;
//       transition:
//         background-color 0.15s ease,
//         opacity 0.15s ease;
//     }
//     .checkout-cta:hover:not(:disabled) {
//       background: #000000;
//     }
//     .checkout-cta:disabled {
//       opacity: 0.45;
//       cursor: not-allowed;
//     }

//     .checkout-mobile-bar {
//       position: fixed;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       z-index: 30;
//       background: var(--surface);
//       border-top: 1px solid var(--line);
//       padding: 12px 16px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 12px;
//       box-shadow: 0 -4px 16px rgba(22, 33, 27, 0.06);
//     }

//     .checkout-spinner {
//       width: 16px;
//       height: 16px;
//       border-radius: 999px;
//       border: 2px solid var(--line);
//       border-top-color: var(--accent);
//       animation: checkout-spin 0.7s linear infinite;
//     }
//     @keyframes checkout-spin {
//       to {
//         transform: rotate(360deg);
//       }
//     }

//     @media (prefers-reduced-motion: reduce) {
//       .checkout-spinner {
//         animation: none;
//       }
//     }
//   `}</style>
// );

// export default CheckoutPage;
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getToken,
  getUser,
  getGuestId,
  clearAuth,
} from "../../../src/lib/auth";

// ==================== TYPES ====================

interface Variant {
  _id?: string;
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
  price?: number;
  discountPrice?: number;
  images?: string[];
}

interface CartItem {
  _id: string;
  product: Product;
  variant?: Variant | null;
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

// ==================== SHIPPING ====================

const SHIPPING_FEE = 30_000; // 30.000đ
const FREE_SHIPPING_THRESHOLD = 2_000_000; // ≥ 2 triệu → miễn phí

const getShippingFee = (subtotal: number): number =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

// ==================== HELPERS ====================

const getUserId = () => {
  if (typeof window === "undefined") return "";
  const authUser = getUser();
  if (authUser?.id) return authUser.id;
  return getGuestId() || "";
};

/** Item hợp lệ: có _id, có product, quantity > 0 */
const isValidCartItem = (item: CartItem): boolean => {
  return !!(item?._id && item.product?._id && item.quantity > 0);
};

const getEffectivePrice = (item: CartItem): number => {
  const v = item.variant;
  if (v?.discountPrice != null && v.discountPrice < (v.price ?? 0)) {
    return v.discountPrice;
  }
  if (v?.price != null) return v.price;
  if (
    item.product?.discountPrice != null &&
    item.product.discountPrice < (item.product.price ?? 0)
  ) {
    return item.product.discountPrice;
  }
  return item.product?.price ?? 0;
};

const getOriginalPrice = (item: CartItem): number =>
  item.variant?.price ?? item.product?.price ?? 0;

const isOnSale = (item: CartItem): boolean => {
  const v = item.variant;
  if (v?.discountPrice != null && v.discountPrice < (v.price ?? 0)) return true;
  if (
    item.product?.discountPrice != null &&
    item.product.discountPrice < (item.product.price ?? 0)
  ) {
    return true;
  }
  return false;
};

const getImageUrl = (imgPath?: string | null): string => {
  if (!imgPath) return "/img/placeholder.jpg";
  if (imgPath.startsWith("http")) {
    return imgPath.replace(/^http:\/\//, "https://");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${
    imgPath.startsWith("/") ? "" : "/"
  }${imgPath}`;
};

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

  const fetchIdRef = useRef(0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const redirectToLogin = useCallback(() => {
    clearAuth();
    router.push("/login?redirect=/checkout");
  }, [router]);

  // ─── Fetch cart ───────────────────────────────────────
  const fetchCart = useCallback(async (): Promise<CartItem[]> => {
    if (!userId) return [];

    const myFetchId = ++fetchIdRef.current;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      if (res.status === 401) {
        redirectToLogin();
        return [];
      }
      if (!res.ok) throw new Error("Không thể tải giỏ hàng");

      const data = await res.json();
      const items: CartItem[] = (data.items || []).filter(isValidCartItem);

      if (myFetchId !== fetchIdRef.current) return items;

      setCartItems(items);
      return items;
    } catch (err: unknown) {
      if (myFetchId !== fetchIdRef.current) return [];
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải giỏ hàng",
      );
      return [];
    }
  }, [userId, redirectToLogin]);

  // ─── Mount: load cart + addresses ─────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          },
        );
        if (res.status === 401) {
          redirectToLogin();
          return;
        }
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            (errorData as { error?: string }).error ||
              "Không thể tải danh sách địa chỉ",
          );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, router]);

  // Refetch khi có sự kiện cart-updated
  useEffect(() => {
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, [fetchCart]);

  // ─── Derived ──────────────────────────────────────────
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

  const shippingFee = getShippingFee(subtotal);
  const grandTotal = subtotal + shippingFee;
  const isFreeShipping = shippingFee === 0;
  const amountToFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // ─── Address form ─────────────────────────────────────
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ─── Submit order ─────────────────────────────────────
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }
    if (!selectedAddress && !useNewAddress) {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
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
      const freshItems = (await fetchCart()).filter(isValidCartItem);

      if (freshItems.length === 0) {
        setError("Giỏ hàng trống hoặc chứa sản phẩm không hợp lệ.");
        setSubmitting(false);
        return;
      }

      const freshSubtotal = freshItems.reduce(
        (total, item) => total + getEffectivePrice(item) * item.quantity,
        0,
      );
      const freshShippingFee = getShippingFee(freshSubtotal);
      const freshGrandTotal = freshSubtotal + freshShippingFee;

      const payload = {
        products: freshItems.map((item) => ({
          product: item.product._id,
          ...(item.variant?._id ? { variant: item.variant._id } : {}),
          quantity: item.quantity,
        })),
        totalPrice: freshGrandTotal,
        shippingFee: freshShippingFee,
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

      if (res.status === 401) {
        redirectToLogin();
        return;
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string }).error || "Thanh toán thất bại",
        );
      }

      const createdOrder = await res.json();

      setCartItems([]);
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

  // ─── Loading ──────────────────────────────────────────
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

  // ─── Render ───────────────────────────────────────────
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
                          src={getImageUrl(
                            item.variant?.image || item.product?.images?.[0],
                          )}
                          alt={item.product?.name || "Sản phẩm"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--ink)] truncate">
                          {item.product?.name || "Không có tên"}
                        </p>
                        {item.variant &&
                          (item.variant.size || item.variant.color) && (
                            <p className="text-xs text-[var(--muted)] mt-0.5">
                              {item.variant.size && `Size ${item.variant.size}`}
                              {item.variant.size && item.variant.color && " · "}
                              {item.variant.color &&
                                `Màu ${item.variant.color}`}
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
                      className={`checkout-option ${
                        checked ? "checkout-option--active" : ""
                      }`}
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

        {/* ================= RIGHT COLUMN — RECEIPT ================= */}
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
                <span
                  className={
                    isFreeShipping
                      ? "text-[var(--ink)] font-medium"
                      : "text-[var(--ink)]"
                  }
                >
                  {isFreeShipping ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="line-through text-[var(--muted)] text-xs">
                        {formatPrice(SHIPPING_FEE)}
                      </span>
                      <span>Miễn phí</span>
                    </span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              {/* Gợi ý miễn phí ship */}
              {!isFreeShipping && cartItems.length > 0 && (
                <div className="mt-1 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-[11px] text-[var(--muted)] leading-relaxed">
                  Mua thêm{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    {formatPrice(amountToFreeShip)}
                  </span>{" "}
                  để được{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    miễn phí vận chuyển
                  </span>
                </div>
              )}

              {isFreeShipping && cartItems.length > 0 && (
                <div className="mt-1 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-[11px] text-[var(--ink)] font-medium">
                  ✓ Đơn hàng đủ điều kiện miễn phí vận chuyển
                </div>
              )}
            </div>

            <div className="checkout-notches" />

            <div className="flex justify-between items-baseline">
              <span className="font-medium text-[var(--ink)]">Tổng cộng</span>
              <span className="font-display text-xl font-semibold text-[var(--ink)]">
                {formatPrice(grandTotal)}
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
              {formatPrice(grandTotal)}
            </p>
            {!isFreeShipping && cartItems.length > 0 && (
              <p className="text-[10px] text-[var(--muted)]">
                (đã gồm ship {formatPrice(SHIPPING_FEE)})
              </p>
            )}
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
